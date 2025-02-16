import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import axios from "axios";

//components
import TextInput from "../TextInput";
import InputLabel from "../InputLabel";
import InputError from "../InputError";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";

//socket
import { useEventBus } from "@/EventBus";

export default function MessageModal({ show = false, onClose = () => {}, message }) {
    const { emit } = useEventBus();

    const { data, setData, processing, errors, reset, post, put } = useForm({
        id: message.id,
        message: message.message,
    });

    const updateMessage = (e) => {
        e.preventDefault();

        axios
            .put(route("message.update", message.id), data)
            .then((res) => {
                emit("toast.show", "Message update successfully");
                onClose();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={updateMessage} className="p-6 overflow-y-auto">
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Update Message</h2>

                <div className="mt-8">
                    <InputLabel htmlFor="name" value="Content" />
                    <TextInput
                        id="message"
                        className="mt-1 block w-full"
                        value={data.message}
                        onChange={(e) => setData("message", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Update
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
