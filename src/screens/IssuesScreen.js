import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { authService } from "../api/authService";
import CustomHeader from "../components/CustomHeader";
import { useDevice } from "../utils/useDeviceLayout";

export default function IssuesScreen({ navigation }) {
  const { t } = useTranslation();
  const { ui } = useDevice(); // ✅ get dynamic UI tokens

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
      setPage(nextPage);
    } catch (e) {
      console.log("Load More Error:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  const updateStatus = async (ticketId, status) => {
    try {
      const formData = new FormData();
      formData.append("user_status", status);
      const res = await authService.updateTicketStatus(ticketId, formData);

      if (res?.data?.message) {
        setTickets(prev =>
          prev.map(item =>
            item.id === ticketId ? { ...item, user_status: status } : item
          )
        );
      }
    } catch (e) {
      console.log("Update Status Error:", e?.response?.data);
    }
  };

  const dialPhone = phoneNumber => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not available");
      return;
    }
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const sendEmail = email => {
    if (!email) {
      Alert.alert("Error", "Email address not available");
      return;
    }
    Linking.openURL(`mailto:${email}`);
  };

  const renderStatus = (urstatus, status) => {
    if (urstatus === "satisfied")
      return <Text style={[styles.statusText, { color: "#007bff", fontSize: ui.font.body }]}>{t('issues.satisfied')}</Text>;

    if (urstatus === "not_satisfied")
      return (
        <View style={styles.statusRow}>
          <View>
            <Text style={[styles.statusText, { color: "#F0B400", fontSize: ui.font.body }]}>{t('issues.not_satisfied')}</Text>
          </View>
          <View style={styles.statusIcons}>
            <TouchableOpacity onPress={() => dialPhone("1800 250 1232")}>
              <Icon name="phone-call" size={ui.font.h2} color="#0099cc" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sendEmail("cs@support.com")}>
              <Icon name="mail" size={ui.font.h2} color="#0099cc" />
            </TouchableOpacity>
          </View>
        </View>
      );

    return <Text style={[styles.statusText, { color: "red", fontSize: ui.font.body }]}>{status?.toUpperCase()}</Text>;
  };

  const renderItem = ({ item }) => (
    <View style={[styles.ticketCard, { padding: ui.spacing.md, borderRadius: ui.radius }]}>
      <Text style={[styles.ticketDate, { fontSize: ui.font.small }]}>
        {moment(item.created_at).format("ddd, DD MMM YYYY")}
      </Text>

      <Text style={[styles.ticketLabel, { fontSize: ui.font.body }]}>{t('issues.issue')}</Text>
      <Text style={[styles.ticketMessage, { fontSize: ui.font.body }]}>{item.message}</Text>

      {item?.replies?.map((reply, idx) => (
        <Text key={idx} style={[styles.ticketMessage, { fontSize: ui.font.body, marginLeft: ui.spacing.md }]}>
          {reply.message}
        </Text>
      ))}

      <View style={{ marginTop: ui.spacing.md }}>
        {renderStatus(item.user_status, item.status)}
      </View>

      {item.user_status === null && (
        <View style={[styles.buttonRow, { marginTop: ui.spacing.md }]}>
          <TouchableOpacity
            onPress={() => updateStatus(item.id, "satisfied")}
            style={[styles.actionBtn, { borderColor: "#007bff", paddingVertical: ui.spacing.sm, borderRadius: ui.radius }]}
          >
            <Icon name="smile" size={ui.font.h2} color="#007bff" />
            <Text style={[styles.btnText, { color: "#007bff", fontSize: ui.font.body }]}>{t('issues.satisfied')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updateStatus(item.id, "not_satisfied")}
            style={[styles.actionBtn, { borderColor: "#f0b400", paddingVertical: ui.spacing.sm, borderRadius: ui.radius }]}
          >
            <Icon name="frown" size={ui.font.h2} color="#f0b400" />
            <Text style={[styles.btnText, { color: "#f0b400", fontSize: ui.font.body }]}>{t('issues.not_satisfied')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        headertextstyle={{ textAlign: "center", fontSize: ui.font.h2 }}
        title={t('issues.issue_list')}
        rightComponent={() => null}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={ui.font.h2} color="#000" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: ui.spacing.lg }} /> : null}
        ListEmptyComponent={
          !loading && (
            <View style={[styles.noDataContainer, { padding: ui.spacing.lg }]}>
              <Text style={[styles.noDataText, { fontSize: ui.font.body }]}>{t('issues.no_data_available')}</Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: ui.spacing.xl }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  ticketCard: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    marginHorizontal: 10,
    marginVertical: 6,
  },
  ticketDate: {
    color: "gray",
    marginBottom: 5,
  },
  ticketLabel: {
    fontWeight: "600",
  },
  ticketMessage: {
    marginLeft: 10,
  },
  statusText: {
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
  },
  btnText: {
    marginLeft: 8,
    fontWeight: "600",
  },
  noDataContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noDataText: { color: "#999", fontWeight: "500" },
});
