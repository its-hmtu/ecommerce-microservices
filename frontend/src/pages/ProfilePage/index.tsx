import React from "react";
import { getOrders } from "../../api/order";

function ProfilePage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrders();
        console.log(orders);
        setIsLoading(false);
        setOrders(orders);
      } catch (e: any) {
        console.log(e.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {orders?.filter(item => item.status === "completed").map((item: any) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                marginBottom: 20,
                alignItems: "center",
                gap: 20,
                minWidth: 600,
                // boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                padding: 20,
                // borderRadius: 5,
                borderBottom: "1px solid #ccc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <h3>Order Id: {item._id}</h3>
                  <p>
                    Status:
                    {" " + item.status}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Items: {item.items.length}</p>
                    <h3>Total: ${item.totalAmount}</h3>
                  </div>
                  <p>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
