const Message = require('../models/Message');
const mongoose = require('mongoose');

// Obtenir tous mes messages
exports.getMessages = async (req, res) => {
  try {
    const { conversationWith, page = 1, limit = 20 } = req.query;

    const query = {
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    };

    if (conversationWith) {
      query.$or = [
        { sender: req.user.id, receiver: conversationWith },
        { sender: conversationWith, receiver: req.user.id }
      ];
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find(query)
      .populate('sender', 'firstName lastName profilePicture')
      .populate('receiver', 'firstName lastName profilePicture')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Message.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: messages.length,
      total,
      data: {
        messages
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, subject, content, relatedOrder } = req.body;

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      subject,
      content,
      relatedOrder
    });

    await message.populate('sender', 'firstName lastName profilePicture');
    await message.populate('receiver', 'firstName lastName profilePicture');

    res.status(201).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir un message
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'firstName lastName profilePicture')
      .populate('receiver', 'firstName lastName profilePicture')
      .populate('relatedOrder');

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message non trouvé'
      });
    }

    // Vérifier les permissions
    if (message.sender._id.toString() !== req.user.id && 
        message.receiver._id.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Marquer comme lu
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message non trouvé'
      });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Seul le destinataire peut marquer le message comme lu'
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir toutes les conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(req.user.id) },
            { receiver: mongoose.Types.ObjectId(req.user.id) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', mongoose.Types.ObjectId(req.user.id)] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', mongoose.Types.ObjectId(req.user.id)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1
          },
          lastMessage: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      results: conversations.length,
      data: {
        conversations
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir le nombre de messages non lus
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false
    });

    res.status(200).json({
      status: 'success',
      data: {
        unreadCount: count
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};