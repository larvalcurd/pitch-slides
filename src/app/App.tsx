import type { Presentation } from '../entities/presentation/types/PresentationTypes.ts';
import {
    createPresentation,
    updatePresentationTitle,
} from '../entities/presentation/utils/PresentationUtils';
import { PresentationTitle } from '../components/PresentationTitle/PresentationTitle.tsx';
import { useState } from 'react';
import Toolbar, { ToolbarActions } from '../components/Toolbar/Toolbar.tsx';

function App() {
    const [presentation, setPresentation] = useState<Presentation>(() =>
        createPresentation('p1', 'Untitled presentation', [])
    );

    const changeTitle = (newTitle: string) => {
        setPresentation((prevPresentation) => {
            console.log('Presentation title changed:', newTitle);
            return updatePresentationTitle(prevPresentation, newTitle);
        });
    };

    return (
        <div>
            <PresentationTitle title={presentation.title} onTitleChange={changeTitle} />
            <Toolbar actions={ToolbarActions} />
        </div>
    );
}

export default App;
