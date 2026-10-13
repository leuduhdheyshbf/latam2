import { motion } from "motion/react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemDescription?: string;
  itemName?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title = "Confirmar Exclusão",
  itemDescription = "Essa ação é permanente e não poderá ser desfeita.",
  itemName,
  confirmLabel = "Sim, Excluir",
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-red-500/25 bg-[#0e131b] p-6 shadow-2xl shadow-red-950/40"
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-subtle transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <X size={18} />
        </button>

        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-inner shadow-red-500/20">
            <AlertTriangle size={24} />
          </div>
          <div className="pr-6">
            <p className="text-[10px] uppercase font-bold tracking-widest text-red-400">
              Ação Irreversível
            </p>
            <h3 className="font-display text-2xl text-silver leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Message */}
        <div className="rounded-xl border border-white/6 bg-[#121821] p-3.5 mb-5">
          {itemName ? (
            <p className="text-sm text-foreground">
              Deseja realmente excluir{" "}
              <span className="font-bold text-red-400 font-mono">
                &ldquo;{itemName}&rdquo;
              </span>
              ?
            </p>
          ) : (
            <p className="text-sm text-foreground">
              Deseja realmente prosseguir com a exclusão?
            </p>
          )}
          <p className="mt-1 text-xs text-subtle leading-relaxed">
            {itemDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="border border-white/10 text-subtle hover:text-foreground hover:bg-white/5"
          >
            Cancelar
          </Button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition-all hover:from-red-500 hover:to-rose-500 hover:shadow-red-600/50 cursor-pointer active:scale-95"
          >
            <Trash2 size={15} />
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
