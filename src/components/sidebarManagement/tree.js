import React, { useState, useEffect, useRef } from "react";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  toggleExpandedForAll,
} from "react-sortable-tree";
import "react-sortable-tree/style.css";
import Loading from "../loading/Loading";
import HeaderSidebarManagement from "./headerSidebarManagement/HeaderSidebarManagement";
import SidebarForm from "./sidebarForm/SidebarForm";
import SidebarFormDelete from "./sidebarForm/SidebarFormDelete.jsx";
import SidebarPopupInfo from "./sidebarForm/SidebarPopupInfo";
import TreeManagement from "./treeManagement/TreeManagement";

const Tree = ({ data, fetchSidebars }) => {
  const [searchString, setSearchString] = useState("");
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFormDelete, setIsOpenFormDelete] = useState(false);
  const [isOpenPopupInfo, setIsOpenPopupInfo] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selectedSideBar, setSelectedSideBar] = useState(); // selected sidebar id to be updated
  const [isLoading, setIsLoading] = useState(true);
  const [treeDataUpdate, setTreeDataUpdate] = useState([]);
  const [treeDataUpdateAll, setTreeDataUpdateAll] = useState([]);
  const [treeDataUpdateNode, settreeDataUpdateNode] = useState([]);
  const [treeDataAddNode, setTreeDataAddNode] = useState([]);
  const [treeDataRemoveNode, setTreeDataRemoveNode] = useState([]);
  const [rowInfoDelete, setRowInfoDelete] = useState([]);

  const inputEl = useRef();
  const updateInputEl = useRef();

  useEffect(() => {
    setTreeData(data);
  }, [data]);

  useEffect(() => {
    if (!treeData || treeData.length) {
      setIsLoading(false);
    } else if (treeData.length === 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else setIsLoading(true);
  }, [treeData]);

  const handleOpenForm = () => {
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
  };

  const handleOpenFormDelete = (rowInfo) => {
    setIsOpenFormDelete(true);
    setRowInfoDelete(rowInfo);
  };

  const handleCloseFormDelete = () => {
    setIsOpenFormDelete(false);
  };

  const handleOpenPopupInfo = () => {
    setIsOpenPopupInfo(true);
  };

  const handleClosePopupInfo = () => {
    setIsOpenPopupInfo(false);
  };

  const getNodeKey = ({ treeIndex }) => treeIndex;

  const createNode = () => {
    const value = inputEl.current.value;

    if (value === "") {
      inputEl.current.focus();
      return;
    }
    let addNodes = [];
    addNodes.push({
      parentId: null,
      title: value,
      expanded: true,
    });
    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: null,
      expandParent: true,
      getNodeKey,
      newNode: {
        parentId: null,
        title: value,
        expanded: true,
      },
    });
    setTreeDataAddNode(addNodes);
    setTreeData(newTree.treeData);
    // handleOpenForm();
    inputEl.current.value = "";
  };

  const updateNode = (rowInfo, newTitle) => {
    if (!rowInfo) return;

    const { node, path } = rowInfo;
    setSelectedSideBar(node);
    // // const value = updateInputEl.current.value;
    let newNode = {
      id: node.id,
      title: newTitle,
      expanded: node.expanded,
      parentId: node.parentId,
      count: node.count,
      children: node.children,
    };
    let newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey,
      newNode: {
        id: node.id,
        title: newTitle,
        expanded: node.expanded,
        parentId: node.parentId,
        count: node.count,
        children: node.children,
      },
    });
    settreeDataUpdateNode(newNode);

    setTreeData(newTree);
  };

  // const addNodeChild = (rowInfo) => {
  //   let { path } = rowInfo;

  //   const value = inputEl.current.value;
  //   // const value = inputEls.current[treeIndex].current.value;

  //   if (value === "") {
  //     inputEl.current.focus();
  //     // inputEls.current[treeIndex].current.focus();
  //     return;
  //   }

  //   let newTree = addNodeUnderParent({
  //     treeData: treeData,
  //     parentKey: path[path.length - 1],
  //     expandParent: true,
  //     getNodeKey,
  //     newNode: {
  //       title: value,
  //     },
  //   });

  //   setTreeData(newTree.treeData);

  //   inputEl.current.value = "";
  //   // inputEls.current[treeIndex].current.value = "";
  // };

  // const addNodeSibling = (rowInfo) => {
  //   let { path } = rowInfo;

  //   const value = inputEl.current.value;
  //   // const value = inputEls.current[treeIndex].current.value;

  //   if (value === "") {
  //     inputEl.current.focus();
  //     // inputEls.current[treeIndex].current.focus();
  //     return;
  //   }

  //   let newTree = addNodeUnderParent({
  //     treeData: treeData,
  //     parentKey: path[path.length - 2],
  //     expandParent: true,
  //     getNodeKey,
  //     newNode: {
  //       title: value,
  //     },
  //   });

  //   setTreeData(newTree.treeData);
  //   handleOpenForm();

  //   inputEl.current.value = "";
  //   // inputEls.current[treeIndex].current.value = "";
  // };
  const deParseData = (treeData, data) => {
    treeData?.forEach((parent, index) => {
      let x = {
        title: parent.title,
        expanded: parent.expanded,
        parentId: parent.parentId,
        id: parent.id,
        count: index + 1,
      };
      data.push(x);
      if (parent.children || parent.children.length > 0) {
        deParseData(parent.children, data);
      }
    });
    return data;
  };
  const removeNode = () => {
    let arrRemoveNode = [];
    const path = rowInfoDelete ? rowInfoDelete.path : null;
    arrRemoveNode.push(rowInfoDelete.node);
    const a = deParseData(arrRemoveNode, []);
    setTreeDataRemoveNode(a);
    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey,
      })
    );
    handleCloseFormDelete();
  };

  const updateTreeData = (treeData) => {
    setTreeData(treeData);
  };

  const expand = (expanded) => {
    setTreeData(
      toggleExpandedForAll({
        treeData,
        expanded,
      })
    );
  };

  const expandAll = () => {
    expand(true);
  };

  const collapseAll = () => {
    expand(false);
  };

  const alertNodeInfo = ({ node, path, treeIndex }) => {
    const objectString = Object.keys(node)
      .map((k) => (k === "children" ? "children: Array" : `${k}: '${node[k]}'`))
      .join(",\n   ");

    global.alert(
      "Info passed to the icon and button generators:\n\n" +
        `node: {\n   ${objectString}\n},\n` +
        `path: [${path.join(", ")}],\n` +
        `treeIndex: ${treeIndex}`
    );
    handleOpenPopupInfo();
    // return (
    //   <div>
    //     {isOpenFormDelete ? (
    //       <>
    //         <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
    //           <div className="relative w-auto my-6 mx-auto max-w-xl">
    //             {/*content*/}
    //             <div className="border-0 rounded-lg shadow-lg relative px-5 flex flex-col w-full bg-white outline-none focus:outline-none">
    //               {/*header*/}
    //               <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
    //                 <h3 className="text-xl font-semibold">
    //                   Info passed to the icon and button generators:
    //                 </h3>
    //                 <button
    //                   className="p-1 ml-auto t border-0 text-black "
    //                   // onClick={onCloseFormDelete}
    //                 >
    //                   <span className="text-red-500 text-xl font-semibold">
    //                     x
    //                   </span>
    //                 </button>
    //               </div>
    //               {/*body*/}
    //               <h5>Node: {objectString}</h5>
    //               <h5>Path: [{path.join(",")}]</h5>
    //               <h5>treeIndex: {treeIndex}</h5>
    //               {/*footer*/}
    //               <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
    //                 <button
    //                   className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
    //                   type="button"
    //                   // onClick={onCloseFormDelete}
    //                 >
    //                   Close
    //                 </button>
    //                 <button
    //                   className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
    //                   type="submit"
    //                   // onClick={() => {
    //                   //   removeNode(rowInfo);
    //                   // }}
    //                 >
    //                   Delete
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="fixed inset-0 z-40"></div>
    //       </>
    //     ) : null}
    //   </div>
    // );
  };

  const selectPrevMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null
        ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
        : searchFoundCount - 1
    );
  };

  const selectNextMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0
    );
  };

  return (
    <div className="ml-10">
      <HeaderSidebarManagement
        inputEl={inputEl}
        updateInputEl={updateInputEl}
        createNode={createNode}
        updateNode={updateNode}
        expandAll={expandAll}
        collapseAll={collapseAll}
        searchString={searchString}
        setSearchString={setSearchString}
        searchFoundCount={searchFoundCount}
        selectNextMatch={selectNextMatch}
        selectPrevMatch={selectPrevMatch}
        searchFocusIndex={searchFocusIndex}
        treeData={treeData}
        selectedSideBar={selectedSideBar}
        fetchSidebars={fetchSidebars}
        treeDataUpdate={treeDataUpdate}
        treeDataUpdateAll={treeDataUpdateAll}
        treeDataUpdateNode={treeDataUpdateNode}
        treeDataRemoveNode={treeDataRemoveNode}
        treeDataAddNode={treeDataAddNode}
      />

      <div
        style={{ height: "100vh", position: "relative", marginLeft: "20px" }}
      >
        {!isLoading ? (
          <SortableTree
            className=""
            treeData={treeData}
            onMoveNode={(treeData) => {
              setTreeDataUpdateAll(treeData.treeData);
              let treeUpdateArr = [...treeDataUpdate];
              let node = treeData.node;
              node.parentId = treeData.nextParentNode
                ? treeData.nextParentNode.id
                : null;
              treeUpdateArr.push(node);
              setTreeDataUpdate(treeUpdateArr);
            }}
            onChange={(treeData) => {
              updateTreeData(treeData);
            }}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={(matches) => {
              setSearchFoundCount(matches.length);
              setSearchFocusIndex(
                matches.length > 0 ? searchFocusIndex % matches.length : 0
              );
            }}
            canDrag={({ node }) => !node.dragDisabled}
            onDragStateChanged={(node) => {}}
            generateNodeProps={(rowInfo) => ({
              // title: rowInfo.node.label,
              // subtitle: rowInfo.node.subTitle,
              buttons: [
                <div className="text-sm">
                  {/* <button
                  id="addSiblingEl"
                  className="px-2 py-1 mx-2 text-white bg-blue-400 hover:bg-blue-500 rounded-md transition-primary"
                  label="Add Sibling"
                  onClick={(event) => addNodeSibling(rowInfo)}
                >
                  Add Sibling
                </button>
                <button
                  id="addChildEl"
                  className="px-2 py-1 mx-2 text-white bg-blue-400 hover:bg-blue-500 rounded-full transition-primary"
                  label="Add Child"
                  onClick={(event) => addNodeChild(rowInfo)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button> */}
                  <button
                    id="updateEl"
                    className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Update"
                    onClick={(event) => setSelectedSideBar(rowInfo)}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button
                    id="deleteEl"
                    className="px-2 py-1 mx-2 text-red-400 border-2 border-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full transition-primary"
                    label="Delete"
                    onClick={(event) => handleOpenFormDelete(rowInfo)}
                    // onClick={(event) => removeNode(rowInfo)}
                  >
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                  <button
                    className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                    label="Alert"
                    onClick={(event) => alertNodeInfo(rowInfo)}
                  >
                    <i className="fa-sharp fa-solid fa-circle-info"></i>
                  </button>
                </div>,
                <SidebarFormDelete
                  removeNode={removeNode}
                  rowInfoDelete={rowInfoDelete}
                  onCloseFormDelete={handleCloseFormDelete}
                  isOpenFormDelete={isOpenFormDelete}
                />,
              ],
              style: {
                height: "50px",
              },
            })}
            // ...
          />
        ) : (
          <Loading />
        )}
      </div>
      <SidebarForm onCloseForm={handleCloseForm} isOpen={isOpen} />
      {/* <TreeManagement
        updateTreeData={updateTreeData}
        inputEl={inputEl}
        createNode={createNode}
        expandAll={expandAll}
        collapseAll={collapseAll}
        searchString={searchString}
        setSearchString={setSearchString}
        searchFoundCount={searchFoundCount}
        selectNextMatch={selectNextMatch}
        selectPrevMatch={selectPrevMatch}
        searchFocusIndex={searchFocusIndex}
      /> */}
    </div>
  );
};

export default Tree;
