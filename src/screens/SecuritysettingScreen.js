import React,{useState} from "react";
import { View, Text, TouchableOpacity,Alert } from "react-native";
import AppHeader from "../components/AppHeader";
import { common } from "../styles/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import CustomHeader from "../components/CustomHeader";
import { authService } from "../api/authService";
import Storage from "../utils/storage";
import { clearUser, setUser } from "../store/userSlice";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";


const SecuritySettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
const dispatch=useDispatch()
  const deleteAccount = async() => {
     try {
      let formData = new FormData();
    formData.append("_method", 'DELETE');

      const res = await authService.delete_account(formData);
      console.log("delete RESPONSE:", res.data);
if(res?.data?.status===true){
 dispatch(clearUser());
      Storage.setItem('userData',null)
      Storage.setItem('token',null)
      setShowModal(false)
          //setLogoutVisible(false);
          navigation.replace("Login");
}
     


    } catch (e) {
      console.log("delete_account ERROR:", e?.response?.data || e);
      Alert.alert(t('common.error'), e?.message || t('security.failed_to_delete_account'));
    }
     
      return;
    
   
    
  };
  return (
    <View style={common.screen}>
        <CustomHeader
  title={t('security.security_settings')}
rightComponent={<TouchableOpacity></TouchableOpacity>}
  leftComponent={
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={26} color="#000" />
    </TouchableOpacity>
   
  }
/>
      <View style={{ paddingHorizontal: wp("5%"), paddingTop: hp("3%") }}>
        <Text style={{ fontWeight: "700", fontSize: hp("2.2%") }}>{t('security.general')}</Text>

        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginTop: hp("2%") }} onPress={() => navigation.navigate("ChangePassword")}>
          <Ionicons name="key" size={hp("2.6%")} color="#42B5E8" />
          <Text style={{ marginLeft: wp("3%"), fontSize: hp("2.1%") }}>{t('security.change_password')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginTop: hp("3%") }} onPress={() => {setShowModal(true)}}>
          <Ionicons name="person-remove" size={hp("2.6%")} color="#42B5E8" />
          <Text style={{ marginLeft: wp("3%"), fontSize: hp("2.1%") }}>{t('security.delete_account')}</Text>
        </TouchableOpacity>
<TouchableOpacity onPress={()=>navigation.navigate('Terms')}>
        <Text style={{ fontWeight: "700", marginTop: hp("4%"), fontSize: hp("2.2%") }}>{t('security.terms_and_conditions')}</Text>
              </TouchableOpacity>
<TouchableOpacity onPress={
  ()=>navigation.navigate('Privacy')}>

        <Text style={{ fontWeight: "700", marginTop: hp("2%"), fontSize: hp("2.2%") }}>{t('security.privacy_policy')}</Text>
                      </TouchableOpacity>
                      <DeleteAccountModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onDelete={()=>deleteAccount()}
      />

      </View>
    </View>
  );
};

export default SecuritySettingsScreen;
