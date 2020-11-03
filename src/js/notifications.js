import { error, notice, info } from '@pnotify/core';

function throwErrorNotFound() {
  error({
    title: 'Oops!',
    text: 'No images found :( Please enter another query!',
    delay: 1500,
  });
}

function throwNotice() {
  notice({
    title: 'Well..',
    text: 'Something went wrong. Please reload a page.',
    delay: 1500,
  });
}

function throwInfo() {
  info({
    title: 'You found all of them!',
    text: 'No more available pictures for your query.',
    delay: 3000,
  });
}

function throwErrorNoQuery() {
  info({
    title: 'Empty query!',
    text: 'Please enter a query to receive some nice pictures.',
    delay: 1500,
  });
}

export default {
  throwErrorNotFound,
  throwNotice,
  throwInfo,
  throwErrorNoQuery,
};
