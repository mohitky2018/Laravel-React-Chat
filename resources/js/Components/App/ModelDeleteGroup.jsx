//components
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function ModelDeleteGroup({ isOpen = false, setIsOpen = () => {}, onDelete = () => {} }) {
    return (
        <>
            <Dialog
                open={isOpen}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={() => setIsOpen(false)}
            >
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-slate-500 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                Delete Group
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-white/50">
                                Are you sure you want to delete this group? This action cannot be undone.
                            </p>
                            <div className="mt-4 flex items-center justify-end gap-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-red-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={onDelete}
                                >
                                    Yes
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
