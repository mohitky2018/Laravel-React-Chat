import { Fragment } from "react";
import { Link } from "@inertiajs/react";

//components
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import UserAvatar from "./UserAvatar";

//icon
import { UserCircleIcon } from "@heroicons/react/20/solid";

const GroupUsersPopover = ({ members = [] }) => {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <PopoverButton className={`${open ? "text-gray-200" : "text-gray-400"} hover:text-gray-200`}>
                        <UserCircleIcon className="w-6 h-6" />
                    </PopoverButton>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <PopoverPanel className="absolute right-0 z-[100] mt-3 w-[300px] px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="bg-gray-800 p-2">
                                    {members.map((member) => (
                                        <Link
                                            href={route("chat.user", member.id)}
                                            key={member.id}
                                            className="flex items-center gap-2 py-2 px-3 hover:bg-black/30"
                                        >
                                            <UserAvatar user={member} />
                                            <div className="text-xs text-gray-200">{member.name}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default GroupUsersPopover;
