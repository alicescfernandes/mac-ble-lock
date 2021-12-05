const { FiloTag } = require('./filo-tag');
const { GenericTag } = require('./generic-tag');

async function tagFactory(localName, peripheral) {
	switch (localName) {
		case 'FILO-TAG':
			return new FiloTag(peripheral);
			break;
	}
	return new GenericTag();
}

module.exports = {
	tagFactory,
};
