import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";

//components
import TextAreaInput from "../TextAreaInput";
import InputLabel from "../InputLabel";
import InputError from "../InputError";
import Modal from "../Modal";
import TextInput from "../TextInput";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import UserPicker from "./UserPicker";

//socket
import { useEventBus } from "@/EventBus";

export default function GroupModal({ show = false, onClose = () => {} }) {
    const page = usePage();
    const conversations = page.props.conversations;
    const { on, emit } = useEventBus();
    const [group, setGroup] = useState({});

    const { data, setData, processing, errors, reset, post, put } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    const users = conversations.filter((conversation) => !conversation.is_group);

    const createOrUpdateGroup = (e) => {
        e.preventDefault();

        if (group.id) {
            put(route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `Group "${data.name}" was updated`);
                },
            });

            return;
        }

        post(route("group.store"), {
            onSuccess: () => {
                emit("toast.show", `Group "${data.name}" was created`);
                closeModal();
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        return on("GroupModal.show", (group) => {
            console.log("group", group);
            setData({
                name: group.name,
                description: group.description,
                user_ids: group.members.filter((member) => group.owner_id !== member.id).map((member) => member.id),
            });
            setGroup(group);
        });
    }, [on]);

    return (
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={createOrUpdateGroup} className="p-6 overflow-y-auto">
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    {group.id ? `Edit Group "${group.name}"` : "Create new Group"}
                </h2>

                <div className="mt-8">
                    <InputLabel htmlFor="name" value="name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="">
                    <InputLabel htmlFor="description" value="description" />
                    <TextAreaInput
                        id="description"
                        rows="3"
                        className="mt-1 block w-full"
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>

                <div className="mt-4">
                    <InputLabel value="Select Users" />

                    <UserPicker
                        value={users.filter((u) => group.owner_id !== u.id && data.user_ids.includes(u.id)) || []}
                        options={users}
                        onSelect={(users) =>
                            setData(
                                "user_ids",
                                users.map((user) => user.id)
                            )
                        }
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {group.id ? "Update" : "Create"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
