import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    padding: 20,
    paddingTop: 60, 
    backgroundColor: '#F5F7FA', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B6FD6',
    marginBottom: 30,
    textAlign: 'center',
  },
  // --- Novo Card de Informações ---
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
    elevation: 2, // Sombra leve no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    marginBottom: 20, // Espaço entre os itens
  },
  // --------------------------------
  logoutButton: {
    backgroundColor: '#FFCDD2',
    borderWidth: 1,
    borderColor: '#d32f2f',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 'auto', // Empurra para o fundo se sobrar espaço
    marginBottom: 20,
  },
  logoutText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;