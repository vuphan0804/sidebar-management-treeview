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
  const [selectedSidebar, setSelectedSidebar] = useState(); // selected sidebar id to be updated
  const [isLoading, setIsLoading] = useState(true);
  const [treeDataUpdate, setTreeDataUpdate] = useState([]);
  const [treeDataUpdateAll, setTreeDataUpdateAll] = useState([]);
  const [treeDataUpdateNode, setTreeDataUpdateNode] = useState([]);
  const [treeDataAddNode, setTreeDataAddNode] = useState([]);
  const [treeDataAddNodeChild, setTreeDataAddNodeChild] = useState([]);
  const [treeDataRemoveNode, setTreeDataRemoveNode] = useState([]);
  const [rowInfoDelete, setRowInfoDelete] = useState([]);
  const [selectedNodeParent, setSelectedNodeParent] = useState([]);

  const inputEl = useRef();
  const updateInputEl = useRef();
  const inputChildEl = useRef();
  const getNodeKey = ({ treeIndex }) => treeIndex;

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
  // useEffect(() => {
  //   const moveHandle = document.querySelectorAll(".rst__moveHandle");

  //   moveHandle.style.background = "red";
  // }, []);

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
    setSelectedSidebar(node);
    updateInputEl.current.focus();

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
    setTreeDataUpdateNode(newNode);

    setTreeData(newTree);
  };

  const selectedAddNodeChild = (rowInfo) => {
    let { node, path } = rowInfo;
    const value = inputChildEl.current.value;
    setSelectedNodeParent(rowInfo);

    inputChildEl.current.focus();
  };

  const addNodeChild = () => {
    const value = inputChildEl.current.value;

    let addNodeChild = [];

    addNodeChild.push({
      parentId: selectedNodeParent.node.id,
      title: value,
      expanded: true,
    });
    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: selectedNodeParent.path[selectedNodeParent.path.length - 1],
      expandParent: true,
      getNodeKey,
      newNode: {
        parentId: selectedNodeParent.node.id,
        title: value,
      },
    });
    setTreeDataAddNodeChild(addNodeChild);
    setTreeData(newTree.treeData);

    inputChildEl.current.value = "";
    // inputEls.current[treeIndex].current.value = "";
  };

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
    const nodeRemove = deParseData(arrRemoveNode, []);
    setTreeDataRemoveNode(nodeRemove);
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
  const hiDiv = document.getElementById("hi");
  const helloDiv = document.getElementsByClassName("hello");
  for (let i = 0; i < helloDiv.length; i++) {
    helloDiv[i].classList.add("hello-world");
  }
  return (
    <div className="ml-10">
      <HeaderSidebarManagement
        inputEl={inputEl}
        inputChildEl={inputChildEl}
        updateInputEl={updateInputEl}
        createNode={createNode}
        addNodeChild={addNodeChild}
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
        selectedSidebar={selectedSidebar}
        fetchSidebars={fetchSidebars}
        treeDataUpdate={treeDataUpdate}
        treeDataUpdateAll={treeDataUpdateAll}
        treeDataUpdateNode={treeDataUpdateNode}
        treeDataRemoveNode={treeDataRemoveNode}
        treeDataAddNode={treeDataAddNode}
        treeDataAddNodeChild={treeDataAddNodeChild}
        selectedNodeParent={selectedNodeParent}
        setTreeDataUpdate={setTreeDataUpdate}
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
              console.log("treeUpdateArr", treeUpdateArr);
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
            isVirtualized={true}
            searchFinishCallback={(matches) => {
              setSearchFoundCount(matches.length);
              setSearchFocusIndex(
                matches.length > 0 ? searchFocusIndex % matches.length : 0
              );
            }}
            canDrag={({ node }) => !node.dragDisabled}
            onDragStateChanged={(node) => {}}
            generateNodeProps={(rowInfo) => {
              // console.log("rowInfo", rowInfo);
              const moveHandle =
                document.getElementsByClassName("rst__moveHandle");
              let x = rowInfo.node;

              if (x.parentId === null) {
                console.log("kiki", moveHandle[rowInfo.treeIndex]);
                if (moveHandle[rowInfo.treeIndex])
                  moveHandle[rowInfo.treeIndex].classList.add("moveHandleEdit");
              } else {
                if (moveHandle[rowInfo.treeIndex])
                  moveHandle[rowInfo.treeIndex].classList.remove(
                    "moveHandleEdit"
                  );
              }

              return {
                // title: rowInfo.node.label,
                // subtitle: rowInfo.node.subTitle,

                buttons: [
                  <div className="text-sm">
                    <button
                      id="addChildEl"
                      className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Add Child"
                      onClick={(event) => selectedAddNodeChild(rowInfo)}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    <button
                      id="updateEl"
                      className="px-2 py-1 mx-2 text-sky-400 border-2 border-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 rounded-full transition-primary"
                      label="Update"
                      onClick={(event) => setSelectedSidebar(rowInfo)}
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
                  height: "90px; !important",
                },
              };
            }}
            // ...
          />
        ) : (
          <Loading />
        )}
      </div>
      <SidebarForm onCloseForm={handleCloseForm} isOpen={isOpen} />
    </div>
  );
};

export default Tree;
