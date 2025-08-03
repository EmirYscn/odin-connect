import { useOutsideClick } from '../hooks/useOutsideClick';
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';

type ModalContextType = {
  openName: string;
  close: () => void;
  open: React.Dispatch<React.SetStateAction<string>>;
  isDarkMode?: boolean;
};

export const ModalContext = createContext({} as ModalContextType);

type ModalProps = {
  children: React.ReactNode;
};

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = setOpenName;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

type OpenableElement = React.ReactElement<{
  onClick: (e: React.MouseEvent) => void;
  onCloseModal?: (e?: React.MouseEvent) => void;
}>;

type OpenProps = {
  children: OpenableElement;
  opens: string;
};

function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      open(opensWindowName);
    },
  });
}

type WindowProps = {
  children: OpenableElement;
  name: string;
  className?: string;
  onClose?: () => void;
};

function Window({ children, name, className, onClose }: WindowProps) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-[var(--backdrop-color)] z-[1000] backdrop-blur-xs"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={ref}
        className={`fixed top-[50%] left-[50%] translate-[-50%] bg-[var(--color-grey-50)]/80 shadow-2xl text-[var(--color-grey-100)] rounded-[var(--border-radius-lg)] py-[2rem] px-[2.2rem] md:py-[3.2rem] md:px-[4rem] transition-all duration-500 ${className}`}
      >
        <button
          className="bg-none border-none p-[0.4rem] radius-[var(--border-radius-sm)] translate-x-[0.8rem] transition-all duration-200 absolute top-[1.2rem] right-[1.9rem] hover:bg[var(--color-grey-100)]"
          onClick={() => {
            onClose?.();
            close();
          }}
        >
          <HiXMark className="w-5 h-5 text-[var(--color-grey-800)] cursor-pointer" />
        </button>
        <div>
          {cloneElement(children, {
            onCloseModal: (e?: React.MouseEvent) => {
              e?.stopPropagation();
              close();
            },
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
