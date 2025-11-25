import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA', 
    paddingTop: 60, 
    paddingHorizontal: 20 
  },
  
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#2B6FD6', 
    marginBottom: 30, 
    textAlign: 'center',
  },

  subHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B6FD6',
  },
  
  addButton: {
    backgroundColor: '#A5C9F8', 
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#2B6FD6', 
    fontWeight: 'bold',
    fontSize: 18,
  },

  scrollContent: {
    paddingBottom: 80,
  },

  // Card Azul
  cardContainer: {
    width: '100%',
    backgroundColor: '#DDEAFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 18,
  },
  cardInnerBox: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  date: {
    color: '#2B6FD6',
    fontSize: 14,
    fontWeight: '600',
  },
  time: {
    color: '#2B6FD6',
    fontSize: 14,
    fontWeight: '600',
  },
  activityTitle: {
    fontSize: 17,
    color: '#2B6FD6',
    fontWeight: 'bold',
    marginTop: 5,
  },
  bellIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  editButton: {
    flex: 3,
    backgroundColor: '#A5C9F8',
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: '#2B6FD6',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e1eefdff',
    borderColor: '#FF4540',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#C62828',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // --- Novos Estilos para o Picker de Data/Hora ---
  dateTimeSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
  },
  dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F4FF',
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#A5C9F8',
      width: '90%', // Quase metade da largura para cada botão
      justifyContent: 'center'
  },
  dateButtonText: {
      marginLeft: 8,
      color: '#2B6FD6',
      fontWeight: 'bold',
      fontSize: 16,
  },
  bellCustom: {
  width: 22,
  height: 22,
  position: 'absolute',
  right: 15,
  top: 15,
  tintColor: '#A4C8FF', // remove se quiser manter a cor original do ícone
},
pickerIcon: {
  width: 22,
  height: 22,
  tintColor: '#2B6FD6', // mesma cor que você já usa
  marginRight: 8,        // mantém espaçamento idêntico
},
block: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 15,
},

label: {
    fontSize: 14,
    color: '#2B6FD6',
    marginBottom: 6,
    fontWeight: 'bold',
    fontSize: 16
},




});

export default styles;