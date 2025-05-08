import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  createStrategicGoal,
  deleteStrategicGoal,
  getStrategicGoals,
} from "@/services/StrategicGoalsServices";
import { useBrand } from "@/context/BrandContext";
import { updateBrand } from "@/services/BrandServices";

interface StrategicGoalsProps {
  id: string;
  goal: string;
}

export const StrategicGoals = () => {
  const [goals, setGoals] = useState<StrategicGoalsProps[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { brand, updateBrandSelection } = useBrand();

  const handleAddGoal = () => {
    if (goals.length >= 3) return;
    createStrategicGoal({ goal: inputValue, brand_id: brand }).then(() => {
      getStrategicGoals({ brand_id: brand }).then((data) => {
        setGoals(data);
        setInputValue("");
        if (data.length)
          updateBrand({ id: brand, ad_legacy_active: true }).then(() =>
            updateBrandSelection(brand)
          );
      });
    });
  };

  const handleRemoveGoal = (id: string) => {
    deleteStrategicGoal(id).then(() => {
      getStrategicGoals({ brand_id: brand }).then((data) => {
        setGoals(data);
      });
    });
  };

  useEffect(() => {
    getStrategicGoals({ brand_id: brand }).then((data) => {
      setGoals(data);
    });
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto p-5 flex flex-1 justify-center flex-col">
      <motion.div
        animate={{ y: goals.length > 0 ? -goals.length * 8 : 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 120,
          mass: 0.8,
        }}
      >
        <h1 className="font-montserrat font-bold text-4xl mb-5">
          What are your strategic goals?
        </h1>
        <p className="text-base font-light max-w-3xl mb-4">
          Please summarize each of your strategic goals for video commercials in
          one concise sentence.<br></br> We recommend focusing on one to three
          goals at most.
        </p>
        <div className="flex items-center gap-4">
          <Input
            className="focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:outline-none transition-all duration-300 outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={goals.length >= 3}
          />
          <Button
            variant={"outline"}
            onClick={handleAddGoal}
            disabled={goals.length >= 3}
          >
            Add
          </Button>
        </div>
      </motion.div>
      <div className="mt-4">
        <AnimatePresence mode="popLayout">
          {goals.map((goal, _) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="mb-2 p-3 bg-gray-50 rounded-md flex justify-between"
            >
              <p>{goal.goal}</p>
              <div
                className="h-5 w-5 cursor-pointer flex items-center justify-center"
                onClick={() => {
                  handleRemoveGoal(goal.id);
                }}
              >
                <Trash2
                  size={18}
                  className="text-gray-500 hover:text-red-500 transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
