import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Protein } from '../types';
import { proteinApi } from '../services/api';

const ProteinDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [protein, setProtein] = useState<Protein | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProteins, setAllProteins] = useState<Protein[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    proteinApi.getOne(id)
      .then(setProtein)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    proteinApi.getAll().then(setAllProteins);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!protein) return <div>Protein not found.</div>;

  return (
    <div className="main-content">
      <h2>Protein Detail</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Name:</strong> {protein.name}<br />
        <strong>UniProt ID:</strong> {protein.uniprotId}<br />
        <strong>Pathway:</strong> {protein.pathway}<br />
        <strong>Description:</strong> {protein.description}<br />
        <strong>Function:</strong> {protein.function}<br />
        <strong>Interactions:</strong>{' '}
        {protein.interactions?.length === 0 ? 'None' :
          protein.interactions?.map(interaction => {
            const target = allProteins.find(p => p._id === interaction.targetId);
            return `${target ? target.name : interaction.targetId}${interaction.type ? ` (${interaction.type})` : ''}`;
          }).join(', ')
        }
      </div>
      <Link to="/dna-repair/proteins">Back to List</Link>
    </div>
  );
};

export default ProteinDetail; 