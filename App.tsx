import { FlatList, StyleSheet, Text, View } from 'react-native';
type Statut = 'Complet' | 'Presque complet' | 'Ouvert';
type Mode = 'tous';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};
const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

function placesRestantes(event: Evenement): number {
  return ( event.capacite - event.inscrits);
}

function statutEvenement(event: Evenement): Statut {
  const reste= placesRestantes(event);
  if (reste === 0) return 'Complet';
  else if (reste <= 2) return 'Presque complet';
  return 'Ouvert';
}
const totalEvenements = evenements.length;
const nbComplets = evenements.filter((event) => statutEvenement(event) === 'Complet').length;
const nbAvecPlaces = evenements.filter((event) => placesRestantes(event) > 0).length;
const totalPlaces = evenements.reduce((somme, event) => somme + placesRestantes(event),0);

const ateliersDisponibles = evenements.filter(
  (event) => event.categorie === 'Atelier' && placesRestantes(event) > 0
);

const mode = 'tous';

const listeAffichee = mode === 'tous' ? evenements : ateliersDisponibles;
const titreMode = mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles';

type BadgeEtatProps = { statut: Statut };
function BadgeEtat({ statut }: BadgeEtatProps) {
  let fond = '#DCFCE7';   
  let couleurTexte = '#166534';

  if (statut === 'Complet') {
    fond = '#FDE2E2';     
    couleurTexte = '#991B1B';
  } else if (statut === 'Presque complet') {
    fond = '#FFEDD5';    
    couleurTexte = '#684121';
  }

  return (
    <View style={[styles.badge, { backgroundColor: fond }]}>
      <Text style={[styles.badgeTexte, { color: couleurTexte }]}>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const places = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.carte}>
      <View style={styles.carteInfos}>
        <Text style={styles.carteTitre}>{evenement.titre}</Text>
        <Text style={styles.carteCategorie}>{evenement.categorie}</Text>
        <Text style={styles.cartePlaces}>
          {places === 0 ? 'Aucune place' : `${places} place(s) restante(s)`}
        </Text>
      </View>
      <BadgeEtat statut={statut} />
    </View>
  );
}

type BlocStatistiqueProps = { libelle: string; valeur: number };
function BlocStatistique({ libelle, valeur }: BlocStatistiqueProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.blocValeur}>{valeur}</Text>
      <Text style={styles.blocLibelle}>{libelle}</Text>
    </View>
  );
}
export default function App() {
  return (
    <View style={styles.ecran}>
      
      <View style={styles.entete}>
        <Text style={styles.enteteTitre}>CampusAgenda</Text>
        <Text style={styles.enteteSousTitre}>Événements du campus</Text>
      </View>

      <View style={styles.rangeeStats}>
        <BlocStatistique libelle="Événements" valeur={totalEvenements} />
        <BlocStatistique libelle="Complets" valeur={nbComplets} />
        <BlocStatistique libelle="Avec places" valeur={nbAvecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
      </View>

      <Text style={styles.titreMode}>{titreMode}</Text>

      <FlatList
        data={listeAffichee}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={
          <Text style={styles.vide}>Aucun événement à afficher.</Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 48, paddingHorizontal: 16 },

  entete: { backgroundColor: '#3f6cea', borderRadius: 12, padding: 14, alignItems: 'center' },
  enteteTitre: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  enteteSousTitre: { color: '#bfdbfe', fontSize: 14 },

  rangeeStats: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 },
  bloc: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#d9ebeb',
    borderRadius: 10,
    padding: 10,
    margin: 4,
    alignItems: 'center',
  },
  blocValeur: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A' },
  blocLibelle: { fontSize: 13, color: '#334155' },

  titreMode: { fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 8 },

  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#216bcd',
    padding: 12,
    marginBottom: 10,
  },
  carteInfos: { flex: 1, marginRight: 10 },
  carteTitre: { fontSize: 16, fontWeight: 'bold' },
  carteCategorie: { fontSize: 13, color: '#64748B' },
  cartePlaces: { fontSize: 13, color: '#1E3A8A', marginTop: 4 },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeTexte: { fontSize: 12, fontWeight: 'bold' },

  vide: { textAlign: 'center', color: '#3c7acc', marginTop: 24 },
});
