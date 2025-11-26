import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2B6FD6',
    textAlign: 'center',
    marginBottom: 24,
  },

  // CARD DO TOPO
  profileCard: {
    backgroundColor: '#e1eefdff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 26,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileTextArea: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B6FD6',
    textAlign: 'center',
    marginBottom: 4,
  },
  profileSubtext: {
    fontSize: 14,
    color: '#7B8AA0',
    textAlign: 'center',
  },

  // SEÇÕES
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B6FD6',
    marginBottom: 12,
  },

  // CARD DAS LINHAS
  infoRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1eefdff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  connectedCard: {
    backgroundColor: '#e1eefdff',
  },
  
  // --- ÍCONE COM CÍRCULO (Para o Email) ---
  infoIconCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFF', // Círculo Branco
    borderRadius: 20,
  },

  // --- NOVO: ÍCONE SEM CÍRCULO (Para o Responsável) ---
  transparentIconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // Sem background
  },
  // ----------------------------------------------------

  activeIconContainer: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  mailIcon: {
    tintColor: '#2B6FD6',
  },
  logoProfileIcon: {
    width: '100%',
    height: '100%',
  },
  
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#2B6FD6',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B6FD6',
  },

  // PILULA "CONECTADO"
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#CAFFC6',
  },
  statusPillText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2B6FD6',
  },

  // BOTÃO DE SAIR
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D32F2F'
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default styles;