import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
}));

function RenderRow(props) {
  const { index, style } = props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={`${index}`} />
    </ListItem>
  );
}

RenderRow.propTypes = {
  index: PropTypes.number.isRequired,
  //style: PropTypes.object.isRequired,
};

export default function VirtualizedList(props) {
  const { items } = props;
  const classes = useStyles();

  const listItems = items.map((item) =>
    <ListItem key={item}>
        <ListItemText primary={`${item}`} />
    </ListItem>
  );

  return (
    <div className={classes.root}>
      <FixedSizeList height={400} width={300} itemSize={46} itemCount={items.length}>
        {listItems}
      </FixedSizeList>
    </div>
  );
}
