import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA', // Fundo cinza claro geral
    paddingTop: 60, 
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  // --- Cabeçalho ---
  headerContainer: {
    width: '100%',
    marginBottom: 30,
    paddingLeft: 10,
    alignItems: 'center'
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B6FD6', // Azul do tema
  },

  // --- O Card Branco ---
  card: {
    backgroundColor: '#e1eefdff',
    width: '100%',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'space-between', // Distribui espaço entre título, img e botão
    height: '45%', // Altura fixa ou '60%' dependendo do design
    
    // Sombra para destacar o card
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B6FD6',
  },

  // Container para a imagem não estourar
  imageContainer: {
    flex: 1, // Ocupa o espaço disponível no meio
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  illustration: {
    width: '100%',
  },

  // --- Botão de Pânico ---
  panicButton: {
    backgroundColor: '#F8A5A5', // Vermelho alerta
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  panicButtonText: {
    color: '#2B6FD6',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default styles;