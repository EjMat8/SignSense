"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "./confetti";

type ResultModalProps = {
  isOpen: boolean;
  isCorrect: boolean;
  xpEarned?: number;
  streak?: number;
  onAction: () => void;
};

export function ResultModal({
  isOpen,
  isCorrect,
  xpEarned = 10,
  streak = 1,
  onAction,
}: ResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isCorrect && <Confetti />}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={
                isCorrect
                  ? { scale: 1, opacity: 1 }
                  : {
                      scale: 1,
                      opacity: 1,
                      rotate: [0, -2, 2, -2, 2, 0],
                    }
              }
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-card rounded-3xl p-8 shadow-2xl border-2 border-border w-full max-w-sm text-center"
              style={{ borderBottomWidth: "5px" }}
            >
              {isCorrect ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                    className="text-6xl mb-4"
                  >
                    {":)"}
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-success mb-4">
                    Correct!
                  </h2>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-info/10 text-info font-extrabold text-sm px-4 py-2 rounded-xl"
                    >
                      +{xpEarned} XP
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-warning/10 text-warning font-extrabold text-sm px-4 py-2 rounded-xl"
                    >
                      Streak +{streak}
                    </motion.div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAction}
                    className="w-full bg-primary text-primary-foreground font-extrabold text-lg py-3.5 rounded-2xl shadow-md hover:brightness-110 transition-all"
                    style={{ boxShadow: "0 4px 0 0 var(--primary-dark)" }}
                  >
                    Continue
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    {":("}
                  </motion.div>
                  <h2 className="text-3xl font-extrabold text-destructive mb-2">
                    Oops!
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    Try adjusting your angle or lighting. Keep your hand
                    centered in the frame.
                  </p>
                  <p className="text-info font-extrabold text-sm mb-6">
                    +{xpEarned} XP for practicing
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAction}
                    className="w-full bg-destructive text-destructive-foreground font-extrabold text-lg py-3.5 rounded-2xl shadow-md hover:brightness-110 transition-all"
                    style={{ boxShadow: "0 4px 0 0 #CC3C3C" }}
                  >
                    Retry
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
