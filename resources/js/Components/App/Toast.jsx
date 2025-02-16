import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

//socket
import { useEventBus } from "@/EventBus";

const Toast = () => {
    const [toast, setToast] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("toast.show", (message) => {
            const uuid = uuidv4();
            setToast((oldToast) => {
                return [...oldToast, { message, uuid }];
            });
            setTimeout(() => {
                setToast((oldToast) => oldToast.filter((toast) => toast.uuid !== uuid));
            }, 5000);
        });
    }, [on]);

    return (
        <div className="toast min-w-[280px] w-full xs:w-auto">
            {toast.map((toast) => (
                <div key={toast.uuid} className="alert alert-success py-3 px-4 text-gray-100 rounded-md">
                    <span className="">{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export default Toast;
