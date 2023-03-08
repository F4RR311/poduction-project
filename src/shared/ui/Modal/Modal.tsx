import { classNames, Mods } from 'shared/lib/classNames/classNames';
import React, {
    MutableRefObject,
    ReactNode, useCallback, useEffect, useRef, useState,
} from 'react';
import { Portal } from 'shared/ui/Portal/Portal';
import { useTheme } from 'app/providers/ThemeProvider';
import cls from './Modal.module.scss';

interface ModalProps {
    className?: string;
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    lazy?:boolean;
}
const ANIMATION_DELAY = 300;

export const Modal = (props: ModalProps) => {
    const {
        className,
        children,
        isOpen,
        onClose,
        lazy,
    } = props;

    const [isClothing, setIsClothing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const timerRef = useRef() as MutableRefObject<ReturnType<typeof setTimeout >>;
    const { theme } = useTheme();

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
        }
    }, [isOpen]);
    const closeHandler = useCallback(() => {
        if (onClose) {
            setIsClothing(true);
            timerRef.current = setTimeout(() => {
                onClose();
                setIsClothing(false);
            }, ANIMATION_DELAY);
        }
    }, [onClose]);

    const onKeyDown = useCallback((e:KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeHandler();
        }
    }, [closeHandler]);

    const contentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => {
            clearTimeout(timerRef.current);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onKeyDown]);

    const mods:Mods = {
        [cls.opened]: isOpen,
        [cls.isClosing]: isClothing,
    };

    if (lazy && !isMounted) {
        return null;
    }
    return (
        <Portal>
            <div className={classNames(cls.Modal, mods, [className])}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                    className={cls.overlay}
                    onClick={closeHandler}
                >
                    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                    <div
                        className={cls.content}
                        onClick={contentClick}
                    >
                        {children}
                    </div>
                </div>

            </div>
        </Portal>

    );
};
