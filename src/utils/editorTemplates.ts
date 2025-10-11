// Editor templates for TipTap
export interface EditorTemplate {
  id: string;
  name: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  category: 'medical' | 'educational' | 'administrative';
  content: string;
}

export const editorTemplates: EditorTemplate[] = [
  {
    id: 'medicalNote',
    name: 'Note Médicale',
    nameEn: 'Medical Note',
    nameAr: 'ملاحظة طبية',
    icon: '🏥',
    category: 'medical',
    content: `
      <h2>Note Médicale</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <h3>Histoire de la maladie</h3>
      <p>[Décrire ici]</p>
      <h3>Examen clinique</h3>
      <p>[Décrire ici]</p>
      <h3>Diagnostic</h3>
      <p>[Décrire ici]</p>
      <h3>Plan de traitement</h3>
      <p>[Décrire ici]</p>
    `
  },
  {
    id: 'courseSummary',
    name: 'Résumé de Cours',
    nameEn: 'Course Summary',
    nameAr: 'ملخص الدورة',
    icon: '📚',
    category: 'educational',
    content: `
      <h1>Résumé de Cours</h1>
      <h2>Objectifs d'apprentissage</h2>
      <ul>
        <li>Objectif 1</li>
        <li>Objectif 2</li>
        <li>Objectif 3</li>
      </ul>
      <h2>Points clés</h2>
      <p>[Contenu principal]</p>
      <h2>Références</h2>
      <p>[Ajouter les références]</p>
    `
  }
];

export default editorTemplates;
