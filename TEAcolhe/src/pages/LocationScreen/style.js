// src/pages/HomeScreen/style.js
import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F7FA', // Um fundo levemente cinza para destacar os cards brancos
    paddingTop: 50, // Espaço para o topo
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B6FD6', // Azul do título
    marginBottom: 10,
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#b3d6ffff',
    marginBottom: 10,
    fontSize: 16,
    elevation: 2, // Sombra no Android
  },
  statusText: {
    fontSize: 14,
    color: '#2B6FD6',
    marginBottom: 15,
    fontWeight: '500',
  },
  
  // --- CARD DO MAPA ---
  mapCard: {
    width: '100%',
    height: Dimensions.get('window').height * 0.45,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden', // Para o mapa respeitar as bordas arredondadas
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
  // --- BOTÕES ---
  actionButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#e1eefdff', // Azul claro do design
    borderColor: '#FF4540',
    borderWidth: 1
  },
  btnBlue: {
    backgroundColor: '#A5C9F8', //AZUL NORMAL
    marginBottom:  10
  },
  btnGreen: {
    backgroundColor: '#CAFFC6', // Verde claro do design
  },
  btnTextBlue: {
    color: '#2B6FD6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnTextGreen: {
    color: '#2B6FD6',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- CARD DE INFORMAÇÃO (Endereço / Tag) ---
  infoCard: {
    width: '100%',
    backgroundColor: '#e1eefdff', // AZUL CLARINHO
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D6E4F0',
  },
  tagCard: {
    width: '100%',
    backgroundColor: '#e1eefdff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D6E4F0',
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagIcon: {
    width: 50,
    height: 50,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B6FD6',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
  SecAreaTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B6FD6',
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#2B6FD6',
    lineHeight: 22,
  },
  tagText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B6FD6',
    marginLeft: 10,
  },

  // --- GEOFENCE (Slider) ---
  sliderContainer: {
    width: '100%',
    backgroundColor: '#e1eefdff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },
  
  // Input simples para a Tag
  inputSimple: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 12,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: '#A5C9F8',
    textAlign: 'center',
    marginBottom: 10,
  },

  logoutButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  }
});

export default styles;