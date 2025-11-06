const Formation = require('../models/Formation');

// Obtenir toutes les formations
exports.getAllFormations = async (req, res) => {
  try {
    const { category, type, level, page, limit, isPublished, search } = req.query;

    // Pagination sécurisée
    let pageNum = parseInt(page, 10);
    let limitNum = parseInt(limit, 10);
    if (!Number.isFinite(pageNum) || pageNum < 1) pageNum = 1;
    if (!Number.isFinite(limitNum) || limitNum < 1 || limitNum > 100) limitNum = 12;
    const skip = (pageNum - 1) * limitNum;

    // Filtres
    const query = {};
    // isPublished: true par défaut, surcharge possible via query
    if (typeof isPublished !== 'undefined') {
      query.isPublished = String(isPublished) === 'true';
    } else {
      query.isPublished = true;
    }
    if (category) query.category = category;
    if (type) query.type = type;
    if (level) query.level = level;
    if (search && String(search).trim() !== '') {
      const s = String(search).trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } }
      ];
    }

    const formations = await Formation.find(query)
      .populate('instructor', 'firstName lastName profilePicture')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Formation.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: formations.length,
      total,
      data: {
        formations
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir la liste des catégories de formations (distinct)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Formation.distinct('category', { category: { $exists: true, $ne: '' } });
    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir une formation
exports.getFormation = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id)
      .populate('instructor', 'firstName lastName profilePicture')
      .populate('enrolledUsers.user', 'firstName lastName profilePicture');

    if (!formation) {
      return res.status(404).json({
        status: 'error',
        message: 'Formation non trouvée'
      });
    }

    // Vérifier si l'utilisateur est inscrit
    const enrollment = formation.enrolledUsers.find(
      e => e.user._id.toString() === req.user?.id
    );

    res.status(200).json({
      status: 'success',
      data: {
        formation,
        enrollment: enrollment || null
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Créer une formation
exports.createFormation = async (req, res) => {
  try {
    const formationData = {
      ...req.body,
      instructor: req.user.id
    };

    // Gérer la miniature
    if (req.file) {
      formationData.thumbnail = `/uploads/formations/${req.file.filename}`;
    }

    // Parser le contenu si nécessaire
    if (req.body.quizQuestions) {
      formationData.content = {
        ...formationData.content,
        quizQuestions: JSON.parse(req.body.quizQuestions)
      };
    }

    const formation = await Formation.create(formationData);

    res.status(201).json({
      status: 'success',
      data: {
        formation
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Modifier une formation
exports.updateFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!formation) {
      return res.status(404).json({
        status: 'error',
        message: 'Formation non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        formation
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Supprimer une formation
exports.deleteFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndDelete(req.params.id);

    if (!formation) {
      return res.status(404).json({
        status: 'error',
        message: 'Formation non trouvée'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// S'inscrire à une formation
exports.enrollFormation = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);

    if (!formation) {
      return res.status(404).json({
        status: 'error',
        message: 'Formation non trouvée'
      });
    }

    // Vérifier si déjà inscrit
    const alreadyEnrolled = formation.enrolledUsers.some(
      e => e.user.toString() === req.user.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        status: 'error',
        message: 'Vous êtes déjà inscrit à cette formation'
      });
    }

    formation.enrolledUsers.push({
      user: req.user.id,
      progress: 0,
      completed: false
    });

    await formation.save();

    res.status(200).json({
      status: 'success',
      message: 'Inscription réussie',
      data: {
        formation
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Mettre à jour la progression
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const formation = await Formation.findById(req.params.id);

    if (!formation) {
      return res.status(404).json({
        status: 'error',
        message: 'Formation non trouvée'
      });
    }

    const enrollment = formation.enrolledUsers.find(
      e => e.user.toString() === req.user.id
    );

    if (!enrollment) {
      return res.status(400).json({
        status: 'error',
        message: 'Vous n\'êtes pas inscrit à cette formation'
      });
    }

    enrollment.progress = progress;
    if (progress >= 100) {
      enrollment.completed = true;
    }

    await formation.save();

    res.status(200).json({
      status: 'success',
      data: {
        enrollment
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtenir mes formations
exports.getMyFormations = async (req, res) => {
  try {
    const formations = await Formation.find({
      'enrolledUsers.user': req.user.id
    }).populate('instructor', 'firstName lastName');

    const myFormations = formations.map(formation => {
      const enrollment = formation.enrolledUsers.find(
        e => e.user.toString() === req.user.id
      );
      return {
        formation,
        progress: enrollment.progress,
        completed: enrollment.completed,
        enrolledAt: enrollment.enrolledAt
      };
    });

    res.status(200).json({
      status: 'success',
      results: myFormations.length,
      data: {
        formations: myFormations
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

console.log(' Contrôleurs Delivery, Message et Formation créés avec succès !');