import React, { useState, useEffect } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform,Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc, collection, addDoc, deleteDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker'; // <--- BIBLIOTECA NOVA
import styles from './style';

import BellIcon from '../../../assets/icon/notification-icon.png';
import ClockIcon from '../../../assets/icon/time-icon.png';
import CalendarIcon from '../../../assets/icon/calendar-icon.png';



export default function AgendaScreen() {
  const userUID = auth.currentUser?.uid;
  const [userType, setUserType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [targetUserID, setTargetUserID] = useState(null);

  // Estados de Controle da Interface
  const [isAddingTask, setIsAddingTask] = useState(false); 
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Estados para Data e Hora
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date'); // 'date' ou 'time'

  // 1. Identificar Usuário
  useEffect(() => {
    if(userUID) {
        getDoc(doc(db, 'users', userUID)).then(snap => {
            if(snap.exists()) {
                const data = snap.data();
                setUserType(data.tipo);
                if (data.tipo === 'TUTOR' && data.usuarioConectado) {
                    setTargetUserID(data.usuarioConectado);
                } else {
                    setTargetUserID(userUID);
                }
            }
        });
    }
  }, [userUID]);

  // 2. Ler Tarefas
  useEffect(() => {
    if (!targetUserID) return;
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where("userId", "==", targetUserID)); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Ordena por Data (YYYY-MM-DD) e depois por Hora
        tasksList.sort((a, b) => {
            // Converter DD/MM para MM/DD para sort funcionar (gambiarra simples para MVP)
            // O ideal seria salvar timestamp no banco, mas vamos manter strings como pediu
            const dateA = a.date.split('/').reverse().join('-'); 
            const dateB = b.date.split('/').reverse().join('-');
            
            if (dateA !== dateB) return dateA.localeCompare(dateB);
            return a.time.localeCompare(b.time);
        });
        setTasks(tasksList);
    });
    return () => unsubscribe();
  }, [targetUserID]);

  // 3. Funções de Data/Hora
  const onChangeDate = (event, date) => {
    if (Platform.OS === 'android') {
        setShowPicker(false); // Fecha o picker no Android após escolha
    }
    if (date) {
        setSelectedDate(date);
    }
  };

  const showMode = (currentMode) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  // Formata para exibir no botão (DD/MM)
  const formatDate = (date) => {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  // Formata para exibir no botão (HH:mm)
  const formatTime = (date) => {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 4. Funções de Ação
  const handleSaveTask = async () => {
    if (!newTaskTitle.trim()) {
        Alert.alert("Aviso", "O título não pode estar vazio.");
        return;
    }

    try {
        const dateStr = formatDate(selectedDate);
        const timeStr = formatTime(selectedDate);

        if (editingTask) {
            // EDITAR
            await updateDoc(doc(db, 'tasks', editingTask.id), {
                title: newTaskTitle,
                date: dateStr,
                time: timeStr
            });
        } else {
            // ADICIONAR
            await addDoc(collection(db, 'tasks'), {
                userId: targetUserID,
                title: newTaskTitle,
                date: dateStr,
                time: timeStr,
                createdAt: new Date()
            });
        }
        // Limpa e volta para a lista
        setIsAddingTask(false);
        setNewTaskTitle('');
        setEditingTask(null);
        setSelectedDate(new Date()); // Reseta data
    } catch (error) {
        Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  const startAdding = () => {
      setEditingTask(null);
      setNewTaskTitle('');
      setSelectedDate(new Date()); // Começa com "agora"
      setIsAddingTask(true); 
  };

  const startEditing = (task) => {
      setEditingTask(task);
      setNewTaskTitle(task.title);
      
      // Tenta reconstruir a data a partir das strings (DD/MM e HH:mm)
      // Atenção: Assume ano atual, pois não salvamos ano na string
      const [day, month] = task.date.split('/');
      const [hour, minute] = task.time.split(':');
      const reconstruction = new Date();
      reconstruction.setDate(parseInt(day));
      reconstruction.setMonth(parseInt(month) - 1);
      reconstruction.setHours(parseInt(hour));
      reconstruction.setMinutes(parseInt(minute));
      
      setSelectedDate(reconstruction);
      setIsAddingTask(true); 
  };

  const cancelAction = () => {
      setIsAddingTask(false); 
      setNewTaskTitle('');
      setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert("Excluir", "Tem certeza?", [
        { text: "Não", style: "cancel" },
        { text: "Sim", style: "destructive", onPress: async () => await deleteDoc(doc(db, 'tasks', taskId)) }
    ]);
  };

  // --- RENDERIZAÇÃO ---
  
  if (isAddingTask) {
      return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>
                {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
            </Text>
            <Text style={{marginBottom: 10, color: '#2B6FD6', fontWeight: 'bold', fontSize: 20}}>Quando?</Text>
            <View style={styles.cardContainer}>
                      {/* Botões de Seleção de Data e Hora */}
                      <View style={styles.dateTimeSelector}>
                        <View style={styles.block}>
                          <Text style={styles.label}>Data</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={() => showMode('date')}>
                                <Image source={CalendarIcon} style={styles.pickerIcon}/>

                                <Text style={styles.dateButtonText}>{formatDate(selectedDate)}</Text>
                            </TouchableOpacity>
                          </View>

                        <View style={styles.block}>
                          <Text style={styles.label}>Hora</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={() => showMode('time')}>
                                <Image source={ClockIcon}style={styles.pickerIcon}/>

                                <Text style={styles.dateButtonText}>{formatTime(selectedDate)}</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
            </View>

            <Text style={{marginBottom: 10, color: '#2B6FD6', fontWeight: 'bold', fontSize: 20}}>Descrição:</Text>
              <View style={[styles.cardContainer]}>
                  
                      <TextInput
                          style={{
  
                              fontSize: 18, 
                              paddingVertical: 5, 
                              color: '#666',
                              marginBottom: 20
                          }}
                          placeholder="Ex: Ir para a escola"
                          value={newTaskTitle}
                          onChangeText={setNewTaskTitle}
                          autoFocus={false}
                      />


                      {/* O Componente DateTimePicker (Invisível até ser chamado) */}
                      {showPicker && (
                          <DateTimePicker
                              testID="dateTimePicker"
                              value={selectedDate}
                              mode={mode}
                              is24Hour={true}
                              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                              onChange={onChangeDate}
                              // Estilo para iOS ficar em modal
                              style={Platform.OS === 'ios' ? { width: '100%', backgroundColor: 'white' } : undefined}
                          />
                      )}
                      {/* Botão extra pra fechar no iOS se necessário, mas o padrão costuma resolver */}
                      {Platform.OS === 'ios' && showPicker && (
                          <TouchableOpacity 
                              style={{alignSelf:'center', marginTop:10, padding:5}}
                              onPress={() => setShowPicker(false)}
                          >
                              <Text style={{color:'#2B6FD6', fontWeight:'bold'}}>Confirmar Data/Hora</Text>
                          </TouchableOpacity>
                      )}

                  
              </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                <TouchableOpacity 
                    style={[styles.addButton, {backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FF4540', flex: 1, marginRight: 10}]} 
                    onPress={cancelAction}
                >
                    <Text style={[styles.addButtonText, {color: '#FF4540'}]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.addButton, {flex: 1, marginLeft: 10}]} 
                    onPress={handleSaveTask}
                >
                    <Text style={styles.addButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Agenda</Text>

      <View style={styles.subHeaderContainer}>
          <Text style={styles.sectionTitle}>Blocos de atividade</Text>

          {userType === 'TUTOR' && (
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={startAdding}
              >
                  <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
          )}
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
            <Text style={{textAlign: 'center', color: '#888', marginTop: 20}}>Nenhuma atividade agendada.</Text>
        ) : (
            tasks.map((task) => (
                <View key={task.id} style={styles.cardContainer}>
                    <View style={styles.cardInnerBox}>
                        <View style={styles.dateTimeRow}>
                            <Text style={styles.date}>{task.date}</Text>
                            <Text style={styles.time}>{task.time}</Text>
                        </View>
                        <Text style={styles.activityTitle}>{task.title}</Text>
                    </View>

                    <Image
                      source={BellIcon}
                      style={styles.bellCustom}
                    />


                    {userType === 'TUTOR' && (
                        <View style={styles.buttonsRow}>
                            <TouchableOpacity 
                                style={styles.editButton} 
                                onPress={() => startEditing(task)}
                            >
                                <Text style={styles.editText}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.deleteButton} 
                                onPress={() => handleDeleteTask(task.id)}
                            >
                                <Text style={styles.deleteText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ))
        )}
      </ScrollView>
    </View>
  );
}