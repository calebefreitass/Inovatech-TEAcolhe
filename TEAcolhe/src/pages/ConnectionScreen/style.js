import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B6FD6',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#2B6FD6',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  
  // O Card Principal Lilás/Azul Claro
  mainCard: {
    width: '100%',
    backgroundColor: '#E8EFFF', // Cor aproximada da imagem
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 2, // Sombra leve
  },

  // O Toggle (Conectar / Gerar Código)
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#D0DEFA',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    width: '100%',
    height: 50,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#CAFFC6', // Verde claro
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B6FD6',
  },

  // Área do Código
  subtitle: {
    fontSize: 16,
    color: '#2B6FD6',
    fontWeight: '600',
    marginBottom: 15,
  },
  codeBoxContainer: {
    backgroundColor: '#D0DEFA', // Azul um pouco mais escuro que o card
    width: '100%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  instructionText: {
    color: '#2B6FD6',
    marginBottom: 10,
    textAlign: 'center',
  },
  codeDisplay: {
    backgroundColor: '#FFF',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2B6FD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B6FD6',
    letterSpacing: 2,
  },

  // Botões de Ação
  actionButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnCopy: {
    backgroundColor: '#A5C9F8', // Azul botão copiar
  },
  btnGenerate: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#A5C9F8',
  },
  btnTextBlue: {
    color: '#2B6FD6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Botão Sair
  logoutButton: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#d32f2f',
    
  },
  logoutText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;