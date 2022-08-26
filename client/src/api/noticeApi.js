import axios from "axios";
import { getUser } from "../component/getUser/getUser";
import * as StompJs from "@stomp/stompjs";
import "react-toastify/dist/ReactToastify.css";
import "../page/Toast.css";

const baseUrl = "/api/";

export function getNoticeList(setNoticeList) {
  const url = baseUrl + "notice/receiver/" + getUser().userNo;
  axios.get(url).then((res) => {
    setNoticeList(res.data);
  });
}

export function updateNotice(
  noticeNo,
  noticeSender,
  noticeReceiver,
  noticeContent
) {
  const url = baseUrl + `notice/${noticeNo}`;
  axios
    .put(
      url,

      {
        noticeNo: noticeNo,
        sender: noticeSender.name,
        receiver: noticeReceiver.name,
        content: noticeContent,
        isRead: 1,
      }
    )
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => console.log(err));
}

const socketUrl = "ws://localhost:8080/ws-dm/websocket";
// const client = new StompJs.Client();
const client = new StompJs.Client({
  brokerURL: socketUrl,
  connectHeaders: {
    login: "user",
    passcode: "password",
  },
  debug: function(str) {
    console.log(str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

export const wsDocsSubscribe = (setNewNotice, setNoticeList, noticeList) => {
  client.onConnect = () => {
    console.log("연결됨");

    client.subscribe(`/queue/sharedocs/${getUser().id}`, ({ body }) => {
      const dataFromServer = JSON.parse(body);
      console.log(dataFromServer);
      setNewNotice(dataFromServer);
      setNoticeList((noticeList) => [...noticeList, dataFromServer]);
    });
    client.subscribe(`/queue/workspace/${getUser().id}`, ({ body }) => {
      const dataFromServer = JSON.parse(body);
      console.log(dataFromServer);
      setNewNotice(dataFromServer);
      setNoticeList(
        noticeList.length === 0
          ? [dataFromServer]
          : [...noticeList, dataFromServer]
      );
    });
  };
  client.onStompError = (frame) => {
    console.error(frame);
  };

  client.activate();
};

export const wsDisconnect = () => {
  client.deactivate();
};

export const notipublish = (searchList) => {
  if (!client.connected) {
    return;
  }
  searchList.map((element) => {
    return client.publish({
      destination: `/send/sharedocs`,
      body: JSON.stringify({
        sender: getUser(),
        receiver: element,
        content: `${getUser().name}님이 문서를 공유했습니다`,
        isRead: 0,
      }),
    });
  });
};

export const worksapcepublish = (searchList) => {
  if (!client.connected) {
    return;
  }

  searchList.map((element) => {
    return client.publish({
      // destination: `/send/workspace/${element.id}`,
      destination: `/send/workspace`,
      body: JSON.stringify({
        sender: getUser(),
        receiver: element,
        content: `${getUser().name}님이 워크스페이스에 초대했습니다`,
        isRead: 0,
      }),
      skipContentLengthHeader: true,
    });
  });

  console.log(getUser());
};

export const deleteNotice = (noticeNo) => {
  const url = baseUrl + `notice/${noticeNo}`;
  axios.delete(url).then((res) => console.log(res.data));
};