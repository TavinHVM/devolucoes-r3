import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"

interface OrderBtnProps {
    label: string
    onAscClick?: () => void
    onDescClick?: () => void
    }

export default function OrderBtn({label, onAscClick, onDescClick }: OrderBtnProps){

    return (
        <div className="text-white flex items-center h-20 max-w-28">
            <span className="whitespace-pre-line">{label}</span>
            <div className="flex flex-col w-auto px-1 justify-center items-center">
                <Button className="p-0 py-[2px] m-0 w-2 h-auto cursor-pointer bg-transparent hover:bg-slate-700 opacity-60 hover:opacity-100"
                onClick={onAscClick}
                >
                <ChevronUp
                    style={{
                    width: "12px",
                    height: "12px",
                    fontSize: "12px",
                    strokeWidth: "4px"
                    }}
                />
                </Button>
                <Button className="p-0 py-[2px] w-2 h-auto cursor-pointer bg-transparent hover:bg-slate-700 opacity-60 hover:opacity-100"
                onClick={onDescClick}
                >
                <ChevronDown
                    className=""
                    style={{
                    width: "12px",
                    height: "12px",
                    fontSize: "12px",
                    strokeWidth: "4px"
                    }}
                />
                </Button>
            </div>
        </div>
    )
}

