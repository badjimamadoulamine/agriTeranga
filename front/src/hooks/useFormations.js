import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useFormations = (params = {}) => {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les options (catégories, types, niveaux, statuts) depuis l'API
  const fetchOptions = async () => {
    try {
      const response = await apiService.getFormationOptions();
      
      if (response.status === 'success' && response.data) {
        // Catégories depuis l'enum du modèle
        setCategories(response.data.categories || []);
        
        // Types depuis l'enum du modèle
        setTypes(response.data.types || []);
        
        // Niveaux depuis l'enum du modèle
        setLevels(response.data.levels || []);
        
        // Statuts (published/draft)
        setStatuses(response.data.statuses || [
          { value: 'published', label: 'Publiée', raw: true },
          { value: 'draft', label: 'Brouillon', raw: false }
        ]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des options:', err);
      // Valeurs par défaut en cas d'erreur
      setCategories([
        'techniques-culture',
        'gestion-ferme',
        'commercialisation',
        'irrigation',
        'bio',
        'autre'
      ]);
      setTypes(['video', 'article', 'pdf', 'quiz']);
      setLevels(['débutant', 'intermédiaire', 'avancé']);
      setStatuses([
        { value: 'published', label: 'Publiée', raw: true },
        { value: 'draft', label: 'Brouillon', raw: false }
      ]);
    }
  };

  // Récupérer les formations avec filtres
  const fetchFormations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construire les paramètres de requête
      const queryParams = { ...params };
      
      // Convertir le status en isPublished pour l'API
      if (params.status === 'published') {
        queryParams.isPublished = true;
        delete queryParams.status;
      } else if (params.status === 'draft') {
        queryParams.isPublished = false;
        delete queryParams.status;
      } else {
        delete queryParams.status;
      }

      const response = await apiService.getFormations(queryParams);
      
      if (response.status === 'success') {
        setFormations(response.data.formations || []);
        setTotal(response.total || 0);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des formations');
      console.error('Erreur formations:', err);
      setFormations([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle publish/unpublish
  const togglePublish = async (formationId) => {
    try {
      const response = await apiService.toggleFormationPublish(formationId);
      
      if (response.status === 'success') {
        // Mettre à jour localement
        setFormations(prev => 
          prev.map(f => 
            f._id === formationId 
              ? { ...f, isPublished: response.data.formation.isPublished }
              : f
          )
        );
      }
      
      return response;
    } catch (err) {
      throw new Error(err.message || 'Erreur lors du changement de statut');
    }
  };

  // Créer une formation
  const createFormation = async (formationData) => {
    try {
      const response = await apiService.createFormation(formationData);
      
      if (response.status === 'success') {
        await fetchFormations(); // Recharger la liste
      }
      
      return response;
    } catch (err) {
      throw new Error(err.message || 'Erreur lors de la création');
    }
  };

  // Modifier une formation
  const updateFormation = async (formationId, formationData) => {
    try {
      const response = await apiService.updateFormation(formationId, formationData);
      
      if (response.status === 'success') {
        await fetchFormations(); // Recharger la liste
      }
      
      return response;
    } catch (err) {
      throw new Error(err.message || 'Erreur lors de la modification');
    }
  };

  // Supprimer une formation
  const deleteFormation = async (formationId) => {
    try {
      const response = await apiService.deleteFormation(formationId);
      await fetchFormations(); // Recharger la liste
      return response;
    } catch (err) {
      throw new Error(err.message || 'Erreur lors de la suppression');
    }
  };

  // Charger les options au montage du composant
  useEffect(() => {
    fetchOptions();
  }, []);

  // Charger les formations quand les params changent
  useEffect(() => {
    fetchFormations();
  }, [
    params.status,
    params.category,
    params.type,
    params.level,
    params.search,
    params.page,
    params.limit
  ]);

  return {
    formations,
    categories,
    types,
    levels,
    statuses,
    total,
    loading,
    error,
    refetch: fetchFormations,
    togglePublish,
    createFormation,
    updateFormation,
    deleteFormation
  };
};