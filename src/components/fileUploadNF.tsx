import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";

interface FileUploadNFProps {
  onFileChange?: (file: File | null) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function FileUploadNF({
  onFileChange,
  onValidationChange,
}: FileUploadNFProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFileName(selectedFile.name);
      setFile(selectedFile);
      onFileChange?.(selectedFile);
    }
  };

  const isFileSelected = Boolean(file);

  useEffect(() => {
    onValidationChange?.(isFileSelected);
  }, [isFileSelected, onValidationChange]);

  return (
    <div className="space-y-3">
      <Label htmlFor="nf-file" className="text-slate-300">
        Nota Fiscal
      </Label>
      <Input
        id="nf-file"
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
      >
        {fileName ? `Arquivo: ${fileName}` : "Selecionar Nota Fiscal"}
      </Button>

      {/* Status do arquivo */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            file ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm text-slate-300">
          {file ? "Nota Fiscal selecionada" : "Nota Fiscal pendente"}
        </span>
      </div>
    </div>
  );
}
