import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator,StyleSheet ,Linking, Alert} from "react-native";
import Icon from "react-native-vector-icons/Feather";
// import { getTickets } from "../services/ticketService";
import moment from "moment";
import { authService } from "../api/authService";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
export default function IssuesScreen({navigation}) {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async (nextPage = 1) => {
    try {
      setLoading(true);
      const res = await authService.getTicket(nextPage);
console.log(res?.data,"res?.data?.data");

      if (res?.data?.tickets) {
        setTickets(res.data.tickets);
        setLastPage(res.data.last_page);
      }
    } catch (error) {
      console.log("Tickets Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
  if (loadingMore || page >= lastPage) return;

  try {
    setLoadingMore(true);

    const nextPage = page + 1;
    //const res = await authService.getTicket(nextPage);

    // Stop if API returns same items again
    if (!res?.data?.tickets || res.data.tickets.length === 0) {
      setLastPage(page);  // no more pages
      return;
    }

    // setTickets(prev => {
    //   const merged = [...prev, ...res.data.tickets];

    //   // Remove duplicates by ID
    //   const unique = merged.filter(
    //     (v, i, a) => a.findIndex(t => t.id === v.id) === i
    //   );

    //   return unique;
    // });

    setPage(nextPage);
  } catch (e) {
    console.log("Load More Error:", e);
  } finally {
    setLoadingMore(false);
  }
};


  const updateStatus = async (ticketId, status) => {
    //setLoading(true);
  try {
    const formData = new FormData();
    formData.append("user_status", status);
    const res = await authService.updateTicketStatus(ticketId, formData);
console.log("res?.data?.messag",res);

    if (res?.data?.message) {
      // Update UI locally without reloading entire API
      setTickets(prev =>
        prev.map(item =>
          item.id === ticketId ? { ...item, user_status: status } : item
        )
      );
    }
    //setLoading(false);
  } catch (e) {
    //setLoading(false);
    console.log("Update Status Error:", e?.response.data);
  }
};
const dialPhone = (phoneNumber) => {
  if (!phoneNumber) {
    Alert.alert("Error", "Phone number not available");
    return;
  }
  Linking.openURL(`tel:${phoneNumber}`);
};

const sendEmail = (email) => {
  if (!email) {
    Alert.alert("Error", "Email address not available");
    return;
  }
  Linking.openURL(`mailto:${email}`);
};

  const renderStatus = (urstatus,status) => {
    if (urstatus === "satisfied")
      return <Text style={{ color: "blue", fontWeight: "600" }}>{t('issues.satisfied')}</Text>;

    if (urstatus === "not_satisfied") {
    return (
      <View style={{ flex:1,flexDirection: "row", alignItems: "center",justifyContent:'space-between' }}>
        <View>
 <Text style={{ color: "#F0B400", fontWeight: "600", marginLeft: 5 }}>
          {t('issues.not_satisfied')}
        </Text>
        </View>
       
     <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15, // spacing between icons
        }}
      >
         <TouchableOpacity onPress={() => dialPhone("1800 250 1232")}>
    <Icon name="phone-call" size={22} color="#0099cc" />
  </TouchableOpacity>

  {/* Email */}
  <TouchableOpacity onPress={() => sendEmail("cs@support.com")}>
    <Icon name="mail" size={22} color="#0099cc" />
  </TouchableOpacity>
      </View>
      </View>
    );
  }

    return <Text style={{ color: "red", fontWeight: "600" }}>{status?.toUpperCase()}</Text>;
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 15, borderBottomWidth: 0.5, borderColor: "#ccc" }}>
      <Text style={{ fontSize: 16, marginBottom: 5, color: "gray" }}>
        {moment(item.created_at).format("ddd, DD MMM YYYY")}
      </Text>

      <Text style={{ fontWeight: "600" }}>{t('issues.issue')}</Text>
      <Text style={{ marginLeft: 10 }}>{item.message}</Text>
      <Text style={{ fontWeight: "600", marginTop: 10 }}>{t('issues.comment')}</Text>

{item?.replies?.map((item)=>{
  return(
    <>
      <Text style={{ marginLeft: 10 }}>{item.message}</Text>
    </>

  )

})}
      {/* <Text style={{ fontWeight: "600", marginTop: 10 }}>Comment:</Text>
      <Text style={{ marginLeft: 10 }}>{item.reply}</Text> */}

      <View style={{ marginTop: 15 }}>{renderStatus(item.user_status,item.status)}</View>

      {/* Show icons only when not satisfied */}
      {/* {item.user_status === "not_satisfied" && (
        <View style={{ flexDirection: "row", marginTop: 10, gap: 15 }}>
          <Icon name="phone-call" size={24} color="#0099cc" />
          <Icon name="mail" size={24} color="#0099cc" />
        </View>
      )} */}

      {/* Show buttons only when pending */}
      {item.user_status ===null && (
        <View style={{ flexDirection: "row", marginTop: 15, gap: 20 }}>
          <TouchableOpacity
          onPress={() => updateStatus(item.id, "satisfied")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#007bff",
              padding: 10,
              borderRadius: 30,
              flex: 1,
              justifyContent: "center",
                }}
          >
            <Icon name="smile" size={20} color="#007bff" />
            <Text style={{ marginLeft: 8, color: "#007bff" }}>{t('issues.satisfied')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => updateStatus(item.id, "not_satisfied")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#f0b400",
              padding: 10,
              borderRadius: 30,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Icon name="frown" size={20} color="#f0b400" />
            <Text style={{ marginLeft: 8, color: "#f0b400" }}>{t('issues.not_satisfied')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>
        <CustomHeader
        headertextstyle={{ textAlign: "center", }}
        title={t('issues.issue_list')}
        rightComponent={() => null}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />
    <FlatList
      data={tickets}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={0.2}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : null
      }
        ListEmptyComponent={
                !loading && (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>{t('issues.no_data_available')}</Text>
                  </View>
                )
              }
    />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noDataContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  noDataText: { fontSize: 18, color: "#999", fontWeight: "500" },
});