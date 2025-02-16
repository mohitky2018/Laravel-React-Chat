import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

//component
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import GroupDescriptionPopover from "./GroupDescriptionPopover";
import GroupUsersPopover from "./GroupUsersPopover";
import ModelDeleteGroup from "./ModelDeleteGroup";

//socket
import { useEventBus } from "@/EventBus";

//icons
import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

const ConversationHeader = ({ selectedConversation }) => {
    const authUser = usePage().props.auth.user;
    const { emit } = useEventBus();

    const [modelDeleteGroup, setModelDeleteGroup] = useState(false);

    const onDeleteGroup = () => {
        axios
            .delete(route("group.destroy", selectedConversation.id))
            .then((res) => {
                emit("toast.show", "Group deleted successfully");
                setModelDeleteGroup(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Link href={route("dashboard")} className="inline-block sm:hidden">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>

                        {selectedConversation.is_user && <UserAvatar user={selectedConversation} />}
                        {selectedConversation.is_group && <GroupAvatar />}

                        <div>
                            <h3 className="text-gray-500">{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="text-xs text-gray-500">{selectedConversation?.members?.length} members</p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover description={selectedConversation.description} />
                            <GroupUsersPopover members={selectedConversation.members} />
                            {selectedConversation.owner_id === authUser?.id && (
                                <>
                                    <div data-tip="Edit Group" className="tooltip tooltip-left">
                                        <button
                                            onClick={() => emit("GroupModal.show", selectedConversation)}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <PencilSquareIcon className="w-6" />
                                        </button>
                                    </div>
                                    <div data-tip="Delete Group" className="tooltip tooltip-left">
                                        <button
                                            onClick={() => setModelDeleteGroup(true)}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <TrashIcon className="w-6" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            <ModelDeleteGroup isOpen={modelDeleteGroup} setIsOpen={setModelDeleteGroup} onDelete={onDeleteGroup} />
        </>
    );
};

export default ConversationHeader;
