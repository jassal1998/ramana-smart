// CustomModal.js
import LottieView from 'lottie-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';




interface CustomModalProps {
  isVisible: boolean; // Modal visibility state
  onClose: () => void; // Function to close the modal
}

const {width,height}=Dimensions.get('window')

const CustomModal: React.FC<CustomModalProps> = ({ isVisible , onClose }) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={style.modalOverlay}>
        <View style={style.modalContent}>
          <Text style={style.modalText}> Your data has been submitted successfully.</Text>
         <View>
        <LottieView
            source={require('../../../assets/gif/thanku.json')}
            autoPlay
            loop
            style={style.aniimation}
          />
         </View>
          <TouchableOpacity onPress={onClose} style={style.closeButton}>
            <Text style={style.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width:width*0.9,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'rgb(30,129,176)',
    width:width*0.5,
    borderRadius: 10,
  },
  closeButtonText: {
  fontSize:RFValue(16),
    textAlign:'center',
    color: 'white',
    fontWeight: 'bold',
  },
  aniimation: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").height * 0.2,
  },
});

export default CustomModal;
