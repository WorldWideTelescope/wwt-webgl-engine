using System;
using System.Collections.Generic;

namespace wwtlib
{
    public class FolderDownloadAction
    {
        public readonly bool loadChildFolders;
        
        private readonly Action onComplete;
        private int numLoadingFolders = 0;

        public FolderDownloadAction(Action action, bool loadChildFolders)
        {
            this.onComplete = action;
            this.loadChildFolders = loadChildFolders;
        }

        private void FolderLoaded()
        {
            numLoadingFolders--;
            if (numLoadingFolders == 0)
            {
                onComplete();
            }
        }

        public void StartingNewFolderLoad(Folder folder)
        {
            numLoadingFolders++;
            folder.ChildLoadCallback(delegate {
                Wtml.LoadImagesets(folder, this);
                FolderLoaded();
            });
        }

    }

    public class Wtml
    {

        static public Folder GetWtmlFile(string url, Action complete, bool? loadChildFolders)
        {
            if (loadChildFolders == null)
            {
                loadChildFolders = false;
            }
            Folder folder = new Folder();
            folder.Url = url;
            FolderDownloadAction folderDownloadAction = new FolderDownloadAction(complete, (bool)loadChildFolders);
            folderDownloadAction.StartingNewFolderLoad(folder);
            return folder;
        }

        static public void LoadImagesets(Folder folder, FolderDownloadAction folderDownloadAction)
        {
            List<IThumbnail> children = folder.Children;

            foreach (object child in children)
            {
                if (child is Imageset)
                {
                    Imageset imageSet = (Imageset)child;
                    WWTControl.AddImageSetToRepository(imageSet);
                }
                if (child is Place)
                {
                    Place place = (Place)child;
                    if (place.StudyImageset != null)
                    {
                        WWTControl.AddImageSetToRepository(place.StudyImageset);
                    }
                    
                    if (place.BackgroundImageset != null)
                    {
                        WWTControl.AddImageSetToRepository(place.BackgroundImageset);
                    }
                }
                if (child is Folder && folderDownloadAction.loadChildFolders)
                {
                    folderDownloadAction.StartingNewFolderLoad(((Folder)child));
                }
            }


            if (!string.IsNullOrEmpty(WWTControl.ImageSetName))
            {
                string name = WWTControl.ImageSetName.ToLowerCase();
                foreach (Imageset imageset in WWTControl.GetImageSets())
                {
                    if (imageset.Name.ToLowerCase() == name)
                    {
                        WWTControl.Singleton.RenderContext.BackgroundImageset = imageset;
                    }
                }
            }


        }

    }

}
