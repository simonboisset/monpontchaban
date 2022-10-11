import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Règles de confidentialité',
    description: "Règles de confidentialité de l'application Horaire Pont Chaban-Delmas",
  };
};

export default function Privacy() {
  return (
    <div className='flex flex-col space-y-2 p-12 text-justify'>
      <h1 className='text-2xl'>Règles de confidentialité</h1>
      <h2 className='text-lg'>Règles de confidentialité de l'application Horaire Pont Chaban-Delmas</h2>
      <p>
        L’application mobile « Horaire Pont Chaban-Delmas » est développée pour les téléphones mobiles sous le système
        d’exploitation iOS (iPhone/iPod/iPad) et aussi pour Android. Elle vous offre la possibilité de consulter les
        dates de fermeture du pont Chaban-Delmas de Bordeaux et d'en être notifié à l'avance.
      </p>
      <p>
        L’application vous propose en première ouverture le mode d’affichage Accueil avec le status actuel du pont et la
        liste des prochaine fermetures Un bouton en haut à droite permet de demander à être notifié des prochaines
        fermeture du pont. Ce même bouton permet de se désinscrire des notifications s'il est touché à nouveau.
      </p>
      <h2>Collecte des données et sécurité</h2>
      <p>
        L’application mobile « Horaire Pont Chaban-Delmas » collecte des donées pour les smartophones ayant activé les
        notifications. Ces données correspondent aux ID d'installations permetant d'envoyer les notifications aux
        appareils concernés. Pour supprimer ces données il suffit de désactiver les notifications dans l'application.
      </p>
    </div>
  );
}
