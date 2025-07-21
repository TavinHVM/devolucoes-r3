import { ChevronUp, ChevronDown } from "lucide-react";

interface OrderBtnProps {
    label: string;
    onAscClick: () => void;
    onDescClick: () => void;
}

export default function OrderBtn({ label, onAscClick, onDescClick }: OrderBtnProps) {
    return (
        <div className="flex items-center gap-2 cursor-pointer">
            <span>{label}</span>
            <div className="flex flex-col">
                <ChevronUp
                    className="hover:text-blue-500 transition-all"
                    onClick={onAscClick}
                    style={{
                        width: "12px",
                        height: "12px",
                        strokeWidth: "4px",
                    }}
                />
                <ChevronDown
                    className="hover:text-blue-500 transition-all"
                    onClick={onDescClick}
                    style={{
                        width: "12px",
                        height: "12px",
                        strokeWidth: "4px",
                    }}
                />
            </div>
        </div>
    );
}