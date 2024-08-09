import React from 'react';

import type {Meta, StoryObj} from '@storybook/react';

import {useVirtualElementRef} from '../../../hooks';
import {Button} from '../../Button';
import {Text} from '../../Text';
import {FocusTrap} from '../../utils/FocusTrap';
import {Popup} from '../Popup';
import type {PopupPlacement} from '../Popup';

const meta: Meta<typeof Popup> = {
    title: 'Components/Overlays/Popup',
    component: Popup,
};

export default meta;

type Story = StoryObj<typeof Popup>;

export const A11yExample: Story = {
    render: () => <PopupA11yStory />,
};

export const Default: Story = {
    render: function PopupStory(props) {
        const anchorRef = React.useRef<HTMLButtonElement>(null);
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <Popup {...props} open={open} anchorRef={anchorRef} onClose={() => setOpen(false)}>
                    <div style={{padding: 10}}>Popup content</div>
                </Popup>
                <div
                    style={{
                        width: '100%',
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Button ref={anchorRef} onClick={() => setOpen(!open)}>
                        {open ? 'Hide' : 'Show'}
                    </Button>
                </div>
            </React.Fragment>
        );
    },
};

export const Placement: Story = {
    render: function PopupStory(props) {
        const anchorRef = React.useRef<HTMLDivElement>(null);
        const [open, setOpen] = React.useState(true);
        const contentStyle = {padding: 10};
        const placements: PopupPlacement = [
            'top-start',
            'top',
            'top-end',
            'right-start',
            'right',
            'right-end',
            'bottom-end',
            'bottom',
            'bottom-start',
            'left-end',
            'left',
            'left-start',
        ];

        return (
            <div
                ref={anchorRef}
                style={{
                    width: 300,
                    height: 200,
                    border: '2px dashed black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Button onClick={() => setOpen(!open)}>Toggle open</Button>
                {placements.map((placement) => (
                    <Popup
                        key={placement}
                        {...props}
                        open={open}
                        anchorRef={anchorRef}
                        placement={placement}
                    >
                        <div style={contentStyle}>{placement}</div>
                    </Popup>
                ))}
            </div>
        );
    },
    parameters: {
        layout: 'centered',
    },
};

export const Position: Story = {
    render: function PopupStory(props) {
        const [left, setLeft] = React.useState(0);
        const [top, setTop] = React.useState(0);

        const [contextElement, setContextElement] = React.useState<HTMLDivElement | null>(null);
        const anchorRef = useVirtualElementRef({
            rect: {top, left},
            contextElement: contextElement ?? undefined,
        });
        const [open, setOpen] = React.useState(false);

        const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
            setLeft(event.clientX);
            setTop(event.clientY);
        };

        React.useEffect(() => {
            window.dispatchEvent(new CustomEvent('scroll'));
        }, [left, top]);

        return (
            <div>
                <div
                    style={{
                        width: 400,
                        height: 400,
                        position: 'relative',
                        overflow: 'hidden',
                        border: '2px dashed black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => {
                        setOpen(true);
                    }}
                    onMouseLeave={() => {
                        setOpen(false);
                    }}
                >
                    <div ref={setContextElement} />
                    <Text color="complementary">Move cursor here</Text>
                    <Popup {...props} open={open} anchorRef={anchorRef}>
                        <div style={{padding: 10}}>Popup content</div>
                    </Popup>
                </div>
            </div>
        );
    },
    args: {
        disablePortal: true,
    },
    parameters: {
        layout: 'centered',
    },
};

function PopupA11yStory() {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [isExamplePopupOpen, setIsExamplePopupOpen] = React.useState(false);

    const renderButtons = () =>
        new Array(5).fill(0).map((_, index) => <Button key={index}>Button {index}</Button>);

    return (
        <div>
            <h1 style={{lineHeight: '1.5em'}}>
                This is the current popup. The screen reader focus can freely leave it
            </h1>
            <Button size="xl" onClick={() => setIsPopupOpen((prev) => !prev)} ref={buttonRef}>
                {isPopupOpen ? 'Hide' : 'Show'} popup
            </Button>
            <div ref={containerRef} />
            <Popup
                open={isPopupOpen}
                anchorRef={buttonRef}
                onClose={() => setIsPopupOpen(false)}
                autoFocus
                focusTrap
                container={containerRef.current}
            >
                <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
                    This does not trap screen reader focus
                    {renderButtons()}
                </div>
            </Popup>
            <h1 style={{lineHeight: '1.5em'}}>
                And this is what happens when you use role=&quot;dialog&quot;
                aria-modal=&quot;true&quot;. Screen reader focus can now be trapped (depends on
                screen reader&apos;s browser support)
            </h1>
            <div style={{position: 'relative'}}>
                <Button size="xl" onClick={() => setIsExamplePopupOpen((prev) => !prev)}>
                    {isExamplePopupOpen ? 'Hide' : 'Show'} example popup
                </Button>
                {isExamplePopupOpen && (
                    <FocusTrap enabled autoFocus>
                        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 40,
                                left: 0,
                                backgroundColor: '#ffffff',
                                padding: 16,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                width: 200,
                                border: '1px solid black',
                            }}
                            onKeyDown={(e) => {
                                if (e.key.toLowerCase() === 'escape') {
                                    e.preventDefault();
                                    setIsExamplePopupOpen(false);
                                }
                            }}
                            // these 2 props are the ones that to the trapping
                            role="dialog"
                            aria-modal
                        >
                            This traps screen reader focus
                            {renderButtons()}
                        </div>
                    </FocusTrap>
                )}
            </div>
            <span>This is text after example popup.</span>
        </div>
    );
}
