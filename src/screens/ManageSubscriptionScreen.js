import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import CustomHeader from "../components/CustomHeader";
import { colors } from "../styles/theme";
import strings from "../localization/en";
import { authService } from "../api/authService";

const ManageSubscriptionScreen = ({ navigation }) => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
const [paymentVisible, setPaymentVisible] = useState(false);
const [planDetail, setPlanDetail] = useState(null);
const [loadingPlan, setLoadingPlan] = useState(false);
const [showSuccess,setShowSuccess]=useState(false)
  useEffect(() => {
    fetchManageSubscription();
  }, []);

  /* ================= FETCH SUBSCRIPTION ================= */
  const fetchManageSubscription = async () => {
    try {
      setLoading(true);
      const res = await authService.getmanageSubscription();

      if (res?.data?.success) {
        setCurrentPlan(res.data.data.current_plan);
        setAvailablePlans(res.data.data.available_plans || []);
      }
    } catch (error) {
      console.log("Fetch subscription error:", error);
      Alert.alert(strings.common.error, "Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL SUBSCRIPTION ================= */
  const subscriptionCancelapi = () => {
    Alert.alert(
      strings.subscription.cancel,
      strings.subscription.cancel_confirm,
      [
        { text: strings.common.no },
        {
          text: strings.common.yes,
          onPress: async () => {
            try {
              setCancelLoading(true);
              const res = await authService.subscriptionCancel();
console.log("res--->",res);

              if (res?.data?.status) {
                Alert.alert(strings.common.success, res.data.message);
                fetchManageSubscription();
              }
            } catch (error) {
              console.log("Cancel subscription error:", error);
              Alert.alert(strings.common.error, "Failed to cancel subscription");
            } finally {
              setCancelLoading(false);
            }
          },
        },
      ]
    );
  };
  const subscriptionRenew =async () => {
   
            try {
              setCancelLoading(true);
              const res = await authService.subscriptionRenew();
console.log("res--->",res);

              if (res?.data?.status) {
                Alert.alert(strings.common.success, res.data.message);
                fetchManageSubscription();
              }
            } catch (error) {
              console.log("renew subscription error:", error?.response);
              Alert.alert(strings.common.error, error?.response?.data?.message);
            } finally {
              setCancelLoading(false);
            }
         
  };

  /* ================= STATUS FORMAT ================= */
  const formatStatus = status =>
    status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : "";

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }
const handlePayNow = async (id) => {
  try {
    console.log("Subscribing to:", planDetail);
    let formdata=new FormData()
    formdata.append('subscription_id',id)
    const res=await authService.userSubscription(formdata)
    console.log(res,'res===>');
    
if(res?.data?.status===true){
     setPaymentVisible(false);
    setShowSuccess(true)
}else{
    setPaymentVisible(false);
Alert.alert("Error", res?.data?.message)
}
    // 🔗 CALL PAYMENT API HERE
    // POST api/user/subscribe

    // setPaymentVisible(false);
    // setShowSuccess(true)
    //;
  } catch (error) {
    console.log("Payment Error:", error?.response);
    setPaymentVisible(false);
    Alert.alert("Error", error?.response?.data?.message)
  }
};
const fetchPlanDetail = async (planId) => {
  try {
    setLoadingPlan(true);

    const res = await authService.getSubscriptionDetail(planId);
    // api/user/subscriptions/{id}

    if (res?.data?.success) {
      setPlanDetail(res.data.data);
      setPaymentVisible(true);
    }
  } catch (err) {
    console.log("Plan Detail Error:", err);
  } finally {
    setLoadingPlan(false);
  }
};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <CustomHeader
        title={strings.subscription.manage_subscription}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* ================= CURRENT PLAN ================= */}
        {currentPlan && (
          <View style={styles.card}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
<Text style={styles.cardTitle}>
              {strings.subscription.current_plan}
            </Text>

            <TouchableOpacity onPress={subscriptionCancelapi}>
              {cancelLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text style={styles.cancel}>
                  {strings.subscription.cancel}
                </Text>
              )}
            </TouchableOpacity>
            </View>
            

            <View style={styles.row}>
              <Icon name="star" size={26} color="#2B9DE0" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.planName}>{currentPlan.duration_label}</Text>
                <Text style={styles.price}>
                  $ {currentPlan.amount_paid}{" "}
                  <Text style={{ color: "green" }}>
                    {formatStatus(currentPlan.status)}
                  </Text>
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={()=>subscriptionRenew()} style={styles.renewBtn}>
              <Text style={styles.renewText}>
                {strings.subscription.renew}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= AVAILABLE PLANS ================= */}
        {availablePlans.length > 0 && (
          <>
            <Text style={styles.section}>
              {strings.subscription.available_plan}
            </Text>

            {availablePlans.map(plan => (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
<Icon name="star" size={22} />
                  <Text style={[styles.planName,{marginLeft:20}]}>
                    {plan.duration_label}
                  </Text>
                  </View>
                  
                  <Text style={styles.price}>${plan.price}</Text>
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#D4D4D8",
                    marginTop: 20,
                  }}
                />

                {plan.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Icon
                      name="check-circle"
                      size={20}
                      color="#2B9DE0"
                    />
                    <Text style={styles.feature}>{f}</Text>
                  </View>
                ))}

                <TouchableOpacity           onPress={() => fetchPlanDetail(plan.id)}
style={styles.purchaseBtn}>
                  <Text style={styles.purchaseText}>
                    {strings.subscription.purchase}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
       <Modal transparent visible={paymentVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
      
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setPaymentVisible(false)}>
                <Ionicons name="arrow-back" size={22} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Proceed payment</Text>
              <View style={{ width: 22 }} />
            </View>
      
            {loadingPlan ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                {/* Selected Plan */}
                <Text style={styles.sectionTitle}>Selected Plan</Text>
      
                <View style={styles.planRow}>
                  <View style={styles.planLeft}>
                    <Ionicons name="star-outline" size={22} />
                    <View>
                      <Text style={styles.planName}>{planDetail?.name}</Text>
                      <Text style={styles.planDuration}>
                        {planDetail?.duration_label}
                      </Text>
                    </View>
                  </View>
      
                  <Text style={styles.planPrice}>
                    {planDetail?.formatted_price}
                  </Text>
                </View>
      
                {/* PAY NOW */}
                <TouchableOpacity
                  style={styles.payNowBtn}
                  onPress={()=>handlePayNow(planDetail?.id)}
                >
                  <Text style={styles.payNowText}>Pay Now →</Text>
                </TouchableOpacity>
              </>
            )}
      
          </View>
        </View>
      </Modal>
      
      <Modal transparent visible={showSuccess}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {setShowSuccess(false),navigation.navigate('MainTabs')}}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
      
            <Ionicons name="checkmark-circle-outline" size={60} color="#3BAFDA" />
            <Text style={[styles.planPrice,{ fontWeight:'500',paddingTop:15}]}>
              Payment Successfully Completed
            </Text>
            <Text style={[styles.planPrice,{padding:24,fontWeight:'500'}]}>
              Your Plan Is Now Active
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* ================= STYLES ================= */
const styles = {
  card: {
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 16,
    borderColor: "#D4D4D8",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  cancel: { position: "absolute", right: 15,bottom:-8, color: "#777" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  planName: { fontSize: 18, fontWeight: "600" },
  price: { fontSize: 15, marginTop: 2 },

  renewBtn: {
    backgroundColor: "#2B9DE0",
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal:40,
    marginTop: 10,
  },
  renewText: { color: "#fff", fontWeight: "700" },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 20,
  },

  planCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
  },

  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  feature: { fontSize: 14, marginLeft: 10 },

  purchaseBtn: {
    backgroundColor: "#2B9DE0",
    padding: 12,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 60,
  },
  purchaseText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  padding: 20,
},
modalContainer: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
},
modalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
},
modalTitle: {
  fontSize: 18,
  fontWeight: '700',
},
sectionTitle: {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 10,
},
planRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderColor: '#eee',
},
planLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
planName: {
  fontSize: 15,
  fontWeight: '700',
},
planDuration: {
  fontSize: 12,
  color: '#777',
},
planPrice: {
  fontSize: 16,
  fontWeight: '700',
},
payNowBtn: {
  backgroundColor: '#43A6DD',
  paddingVertical: 14,
  borderRadius: 30,
  alignItems: 'center',
  marginTop: 70,
},
payNowText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},
 overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
    justifyContent: 'center', // vertically center
    alignItems: 'center',     // horizontally center
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    position: 'relative', // to position the cross icon
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    color: '#000',
  },
  successSub: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#4B5563',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

};

export default ManageSubscriptionScreen;
