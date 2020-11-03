import React, {useState, useEffect, useRef} from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grow,
    Paper,
    Popper,
    MenuItem,
    MenuList } from '@material-ui/core';

// -- Styles
const useStyles = makeStyles({
    lgScreen: {
        display: "flex",
        justifyContent: "flex-end",
    }
});

export default function SplitButton(props) {
    const {data, setTag} = props;
    const classes = useStyles();
    const anchorRef = useRef(null);
    const [options, setOptions] = useState(data);
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setOptions(data);
    }, [data])

    // Ao clicar numa opção
    const handleMenuItemClick = (event, value, index) => {
        setTag(value);
        setSelectedIndex(index);
        setOpen(false);
    };

    // Abertura e fechamento do botão
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    // Fechamento do botão
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <div className={classes.lgScreen}>
            <ButtonGroup variant="contained" color="primary" ref={anchorRef} disabled={options[0].nome === "Tags" ? true : false} aria-label="split button">
                <Button>Tags</Button>
                <Button
                    color="primary"
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>

            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu">
                                    {options.map((option, index) => (
                                        (option.nome !== undefined) &&
                                        <MenuItem
                                            key={option.key}
                                            selected={index === selectedIndex}
                                            disabled={option.selected}
                                            value={option.nome}
                                            onClick={event => handleMenuItemClick(event, option, index)}
                                        >
                                            {option.nome}
                                        </MenuItem>

                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
                </Popper>
            </div>
        );
}