import * as React from "react";
import classNames from "classnames";
import { AiOutlineClose } from "react-icons/ai";
import type { IDrawerPropTypes } from "./types";

const Drawer: React.FC<IDrawerPropTypes> = React.memo((props) => {
  const { className, open, children, width = 378, onClose } = props;

  const [isEnter, setIsEnter] = React.useState(true);
  const [isLeave, setIsLeave] = React.useState(false);

  const stopHideDrawer = (e: any) => e.stopPropagation();

  const hideDrawer = () => onClose?.();

  React.useEffect(() => {
    let openTimer: NodeJS.Timer;
    let leaveTimer: NodeJS.Timer;
    if (open) {
      openTimer = setTimeout(() => {
        setIsEnter(false);
      }, 200);
    } else {
      setIsLeave(true);
      leaveTimer = setTimeout(() => {
        setIsLeave(false);
      }, 200);
    }

    return () => {
      if (!open) {
        openTimer && clearTimeout(openTimer);
        leaveTimer && clearTimeout(leaveTimer);
      }
    };
  }, [open]);

  return (
    <div className={className}>
      <div
        className={classNames("inset-0 z-[1000] fixed bg-black/40", {
          "animate-fadeIn": isEnter,
          "animate-fadeOut": isLeave,
        })}
      />
      <div onClick={hideDrawer} className="inset-0 z-[1000] fixed">
        <div
          onClick={stopHideDrawer}
          className={classNames("bg-white absolute inset-y-0 left-0", {
            "animate-showLeft": isEnter,
            "animate-hideLeft": isLeave,
          })}
          style={{
            width,
            boxShadow:
              "-6px 0 16px 0 rgba(0,0,0,.08), -3px 0 6px -4px rgba(0,0,0,.12), -9px 0 28px 8px rgba(0,0,0,.05)",
          }}
        >
          <div>
            <div className="flex h-14 px-4 items-center relative">
              <span className="font-bold text-lg">Title</span>
              <div
                onClick={hideDrawer}
                className="flex h-14 transition-colors right-0 text-black/40 w-14 absolute justify-center items-center hover:text-black"
              >
                <AiOutlineClose size={18} />
              </div>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

Drawer.displayName = "Drawer";

export default Drawer;