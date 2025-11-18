import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Alinhado ao topo
    padding: 20,
    paddingTop: 80, // Espaço para a barra de status/título
    backgroundColor: '#F5F7FA', // Mesmo fundo do app
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B6FD6',
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FFCDD2',
    borderWidth: 1,
    borderColor: '#d32f2f',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;