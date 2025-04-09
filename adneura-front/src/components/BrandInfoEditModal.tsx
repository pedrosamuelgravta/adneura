import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader, Redo, SendHorizonal, Sparkles, Undo } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import AutoResizingTextarea from "./AutoResizingTextarea";
import { formatStep } from "@/lib/utils";
import { patchBrandInfo, updateBrandInfo } from "@/services/BrandInfoServices";

type CardBrandInfoProps = {
  id: number;
  step: string;
  content: any;
  disabled?: boolean;
  onSave?: () => void;
};

const BrandInfoEditModal = ({
  id,
  step,
  content,
  disabled = false,
  onSave,
}: CardBrandInfoProps) => {
  const [history, setHistory] = useState([{ step: step, content: content }]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [rerunLoading, setRerunLoading] = useState(false);
  const [activeVersion, setActiveVersion] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [alertRerunOpen, setAlertRerunOpen] = useState(false);

  const getRerunMessage = () => {
    switch (step.toLowerCase()) {
      case "about":
        return "Do you want to rerun your Brand Summary?";
      case "positioning":
        return "Do you want to rerun your Target Audiences and Key Competitors?";
      case "target_audience":
        return "Do you want to rerun your Key Competitors?";
      default:
        return "Do you want to rerun your Neural Audiences?";
    }
  };

  const getRerunDescription = () => {
    switch (step.toLowerCase()) {
      case "about":
        return "Rerunning your Brand Summary will update all your brand info using the latest changes you made.";
      case "positioning":
        return "Rerunning will update your Target Audiences and Key Competitors based on your new positioning.";
      case "target audience":
        return "Rerunning will update your Key Competitors based on your new Target Audience definition.";
      default:
        return " Rerunning will update your Neural Audiences based on your new brand summary.";
    }
  };

  const handleGenerate = async () => {
    setSendLoading(true);
    updateBrandInfo({ id, step, prompt, base_value: content })
      .then((response) => {
        const data = response.data;
        setHistory([...history, { step, content: data.edited_content }]);
        setActiveVersion(history.length);
        setPrompt("");
      })
      .catch((error) => {
        console.error("Error generating content:", error);
      })
      .finally(() => {
        setSendLoading(false);
      });
  };

  const handleSave = async () => {
    if (activeVersion === 0) {
      setDialogOpen(false);
      return;
    }

    try {
      const updatedContent = history[activeVersion].content;
      await updateBrandInfo({ id, step, content: updatedContent });
      setHistory([{ step: step, content: updatedContent }]);
      setPrompt("");
      setActiveVersion(0);
      if (onSave) onSave();
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setDialogOpen(false);
      setAlertRerunOpen(true);
    }
  };

  const onSummaryUpdate = () => {
    setRerunLoading(true);
    patchBrandInfo({ id, rerun: true, step })
      .then(() => {
        if (onSave) onSave();
        setAlertRerunOpen(false);
      })
      .finally(() => {
        setRerunLoading(false);
      });
  };

  const handleUndo = () => {
    if (activeVersion > 0) setActiveVersion(activeVersion - 1);
  };

  const handleRedo = () => {
    if (activeVersion < history.length - 1) setActiveVersion(activeVersion + 1);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && history[activeVersion].content !== history[0].content) {
      setAlertOpen(true);
    }
    setDialogOpen(open);
    setPrompt("");
  };

  const handleAlertCancel = () => {
    setAlertOpen(false);
    setDialogOpen(false);
    setHistory([{ step: step, content: content }]);
    setActiveVersion(0);
    setPrompt("");
  };

  const handleAlertConfirm = async (rerun: Boolean) => {
    if (rerun) {
      onSummaryUpdate();
      return;
    }

    setAlertOpen(false);
    setDialogOpen(false);
    await handleSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (activeVersion === 0 && value !== history[0].content) {
      setHistory((prev) => [...prev, { step, content: value }]);
      setActiveVersion((prev) => prev + 1);
    } else if (activeVersion > 0) {
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[activeVersion].content = value;
        return newHistory;
      });
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild className={`${disabled ? "hidden" : ""}`}>
          <Button className="h-8">
            <Sparkles size={16} fill="#FFFF" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full xl:max-w-[calc(100vw-30%)] sm:max-w-[calc(100vw-10%)]">
          <DialogHeader className="flex flex-row justify-between">
            <DialogTitle>
              Brand Info {">"} {formatStep(step)}
            </DialogTitle>
            <div className="flex gap-3 items-end absolute right-0 mr-14 top-8 w-14 justify-between">
              <Undo
                size={20}
                className={`text-zinc-700 hover:text-zinc-900 cursor-pointer transition-all ${
                  activeVersion > 0 ? "" : "opacity-0 cursor-auto"
                }`}
                onClick={() => handleUndo()}
              />
              <Redo
                size={20}
                className={`text-zinc-700 hover:text-zinc-900 cursor-pointer transition-all ${
                  activeVersion < history.length - 1
                    ? ""
                    : "opacity-0 cursor-auto"
                }`}
                onClick={() => handleRedo()}
              />
            </div>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <AutoResizingTextarea
              value={history[activeVersion].content || ""}
              onChange={handleChange}
              className="min-h-[15rem] h-full border-2 lg:text-base md:text-base focus-visible:ring-transparent focus-visible:border-gray-300"
            />
            <div className="flex flex-col gap-2 mt-3">
              <label htmlFor="">
                Direct edit or improve with AI using the prompt below
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the changes you want to make..."
                  className="block w-full px-3 py-3 text-gray-900 border border-gray-300 rounded-lg outline-1 outline-gray-400 outline-offset-2"
                />
                <Button className="h-full" onClick={() => handleGenerate()}>
                  {sendLoading ? (
                    <Loader className="text-lg h-full w-full animate-spin" />
                  ) : (
                    <SendHorizonal className="text-lg h-full w-full" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                handleSave();
                setDialogOpen(false);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleAlertConfirm(false)}>
              Save
            </AlertDialogAction>
            <AlertDialogCancel onClick={handleAlertCancel}>
              Discard
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={alertRerunOpen} onOpenChange={setAlertRerunOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getRerunMessage()}</AlertDialogTitle>
            <AlertDialogDescription>
              {getRerunDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => handleAlertConfirm(true)}
              disabled={rerunLoading}
            >
              {rerunLoading ? (
                <Loader className="text-lg h-full w-full animate-spin" />
              ) : (
                "Yes, please! "
              )}
            </Button>
            <AlertDialogCancel onClick={handleAlertCancel}>
              Not necessary!
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BrandInfoEditModal;
