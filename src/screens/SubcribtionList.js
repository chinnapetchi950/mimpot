import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { authService } from "../api/authService";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";

export default function SubscriptionScreen({ navigation }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
const [paymentVisible, setPaymentVisible] = useState(false);
const [planDetail, setPlanDetail] = useState(null);
const [loadingPlan, setLoadingPlan] = useState(false);
const [showSuccess,setShowSuccess]=useState(false)

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await authService.subscribtionList();
      setPlans(res.data?.data || []);
    } catch (e) {
      console.log("Subscription error", e);
    } finally {
      setLoading(false);
    }
  };
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

  const renderPlan = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.starCircle}>
              <Ionicons name="star-outline" size={18} color="#555" />
            </View>
            <Text style={styles.planTitle}>{item.duration_label}</Text>
          </View>

          <Text style={styles.price}>{item.formatted_price}</Text>
        </View>

        <View style={styles.divider} />

        {/* Features */}
        {item.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#3BAFDA"
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}

        {/* Purchase Button */}
        <TouchableOpacity
          style={styles.purchaseBtn}
          onPress={() => fetchPlanDetail(item.id)}
        //   onPress={() =>
        //     navigation.navigate("ProceedPayment", {
        //       subscriptionId: item.id,
        //     })
        //   }
        >
          <Text style={styles.purchaseText}>Purchase</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#FFF'}}>
        <CustomHeader
        title={'Unlock Downloads'}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
        rightComponent={() => null}
      />
    {/* <View style={styles.screenHeader}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>

  <Text style={styles.screenTitle}>Unlock Downloads</Text>
</View> */}

  {/* ✅ SUB TITLE (THIS WAS MISSING) */}
  <View style={styles.screenHeader1}>
  <Text style={styles.screenSubTitle}>
    Subscribe to access unlimited PDF & Video downloads.
  </Text>
</View>

    <FlatList
      data={plans}
      renderItem={renderPlan}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
    />
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
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:10
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  starCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  planTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop:8
  },

  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
  },

  purchaseBtn: {
    backgroundColor: "#3BAFDA",
    paddingVertical: 16,
    borderRadius: 28,
    marginTop: 66,
  },

  purchaseText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  screenHeader: {
  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: 10,
  elevation:3,
  flexDirection:'row',justifyContent:'flex-start',alignItems:'center'
},
 screenHeader1: {
  paddingHorizontal: 16,
 paddingTop: 12,
  paddingBottom: 10,
},
screenTitle: {
  fontSize: 22,
  fontWeight: "700",
  //marginTop: 8,
  color: "#111827",
  marginLeft:40
},

screenSubTitle: {
  fontSize: 14,
  color: "#6B7280",
  marginTop: 6,
  lineHeight: 20,
},
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

});
