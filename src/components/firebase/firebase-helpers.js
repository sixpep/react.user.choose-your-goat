import { db } from "./setup";

const fetchGoatsData = () => {
  const unsubscribe = db.collection("goats").onSnapshot((snapshot) => {
    const updatedGoatsData = [];
    snapshot.forEach((doc) =>
      updatedGoatsData.push({ docId: doc.id, ...doc.data() })
    );
    return updatedGoatsData;
  });
};
