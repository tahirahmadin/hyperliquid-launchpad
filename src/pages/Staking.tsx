import { Header } from "@/components/Header";
import { motion } from "framer-motion";

const Staking = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0F] bg-gradient-to-br from-[#0A0B0F] via-[#0f1720] to-[#0A0B0F]">
      <Header />
      <main className="container mx-auto px-4 flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Coming Soon
          </h1>
        </motion.div>
      </main>
    </div>
  );
};

export default Staking;
