// Sample states: healthy, damaged, cancerous
function evaluateCellState(cell) {
    if (cell.state === 'cancerous') {
        return 'target';
    } else if (cell.state === 'damaged') {
        return 'repair';
    } else if (cell.state === 'healthy') {
        return 'monitor';
    } else {
        return 'unknown';
    }
}

function interactWithCell(cell, nanoType) {
    const action = evaluateCellState(cell);
    let result = '';

    switch (action) {
        case 'target':
            result = '';
            if (nanoType === 'target') {
                cell.state = 'removed'; // Simulate removal of cancerous cells
                result = 'Cancerous cell removed'
            }
            return result;
        case 'repair':
            result = '';
            if (nanoType === 'repair') {
                cell.state = 'healthy'; // Simulate repairing damaged cells
                result = 'Damaged cell repaired'
            }

            return result;
        case 'monitor':
            return 'Healthy cell monitored';
        default:
            return 'Unknown cell state';
    }
}

module.exports = {
    interactWithCell,
    evaluateCellState,
};