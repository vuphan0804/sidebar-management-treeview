import React, { useState, useEffect, useCallback } from "react";
import { sidebarAPI } from "../../../api/sidebarAPI";
import { toast } from "react-toastify";

const HeaderSidebarManagement = ({
  inputEl,
  inputChildEl,
  updateInputEl,
  updateNode,
  createNode,
  addNodeChild,
  expandAll,
  collapseAll,
  searchString,
  setSearchString,
  searchFoundCount,
  selectNextMatch,
  selectPrevMatch,
  searchFocusIndex,
  treeData,
  selectedSidebar,
  fetchSidebars,
  treeDataUpdate,
  treeDataUpdateAll,
  treeDataUpdateNode,
  treeDataAddNode,
  treeDataAddNodeChild,
  treeDataRemoveNode,
  selectedNodeParent,
  setTreeDataUpdate,
}) => {
  const [updateSidebar, setUpdateSidebar] = useState(selectedSidebar); //rowInfo
  const [input, setInput] = useState("");
  const [originalDataAll, setOriginalDataAll] = useState([]);
  const [originalDataUpdate, setOriginalDataUpdate] = useState([]);
  const [addNodeChildSidebar, setAddNodeChildSidebar] =
    useState(selectedNodeParent);
  const [inputAddNodeChild, setInputAddNodeChild] = useState("");

  useEffect(() => {
    setUpdateSidebar(selectedSidebar);
    setInput(selectedSidebar?.node?.title || "");
  }, [selectedSidebar]);

  useEffect(() => {
    setAddNodeChildSidebar(selectedNodeParent);
  }, [selectedNodeParent]);

  useEffect(() => {
    setOriginalDataAll(deParseData(treeDataUpdateAll, []));
  }, [treeDataUpdateAll]);

  // useEffect(() => {
  //   setOriginalDataUpdate(deParseData(treeDataUpdate, []));
  // }, [treeDataUpdate]);

  //  Add Node
  useEffect(() => {
    callbackAddNode();
  }, [treeDataAddNode]);
  // Add Node Child
  useEffect(() => {
    callbackAddNodeChild();
  }, [treeDataAddNodeChild]);
  // Update Node
  useEffect(() => {
    callbackUpdateNode();
  }, [treeDataUpdateNode]);
  // Remove Node
  useEffect(() => {
    callbackRemoveNode();
  }, [treeDataRemoveNode]);

  const showToastMessageSuccess = (msg = "Success") => {
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessageError = (msg = "Error") => {
    toast.error(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Transfer Data
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
      if (parent.children && parent.children.length > 0) {
        deParseData(parent.children, data);
      }
    });
    return data;
  };
  const handleSaving = async () => {
    const mockApiSideBars = await sidebarAPI.getSidebars();
    const mockApiIds = mockApiSideBars.data.map((e) => e.id);
    const originalDataAllIds = originalDataAll.map((e) => e.id);

    // Update sidebars
    Promise.all(
      originalDataAll
        .filter((e) => mockApiIds.includes(e.id))
        .map(async (e) => await sidebarAPI.updateSidebar(e.id, e))
    )
      .then(() => showToastMessageSuccess("Save"))
      .then((msgSuccess) => fetchSidebars())
      .catch(() => showToastMessageError())
      .catch((error) => console.log("error", error));

    console.log("mockApiIds", mockApiIds);
  };

  // const handleSaving = async () => {
  //   const mockApiSideBars = await sidebarAPI.getSidebars();
  //   const mockApiIds = mockApiSideBars.data.map((e) => e.id);
  //   // Update sidebars
  //   Promise.all(
  //     originalDataUpdate
  //       .then(() => showToastMessageSuccess())
  //       .filter((e) => mockApiIds.includes(e.id))
  //       .catch(() => showToastMessageError())
  //       .map(async (e) => await sidebarAPI.updateSidebar(e.id, e))
  //   )
  //     .then((msgSuccess) => fetchSidebars())
  //     .catch((error) => console.log("error", error));
  //   setTreeDataUpdate([]);
  //   console.log("mockApiIds", mockApiIds);
  // };

  const callbackAddNode = useCallback(async () => {
    Promise.all(
      treeDataAddNode.map(async (e) => await sidebarAPI.addSidebar(e))
    )
      .then(() => showToastMessageSuccess("Add Node"))
      .then((msgSuccess) => fetchSidebars())
      .catch(() => showToastMessageError())
      .catch((error) => console.log("error", error));
  }, [treeDataAddNode]);

  // const callbackAddNodeChild = useCallback(async () => {
  //   const value = inputChildEl.current.value;
  //   const addNodeChildNew = {
  //     title: value,
  //     expanded: true,
  //     parentId: treeDataAddNodeChild.node.id,
  //     id: "",
  //     count: "",
  //   };
  //   await sidebarAPI
  //     .addSidebar(addNodeChildNew)
  //     .then((msgSuccess) => fetchSidebars())
  //     .catch((error) => console.log("error", error));
  // }, [treeDataAddNodeChild]);
  // console.log("treeDataAddNodeChild", treeDataAddNodeChild);

  const callbackAddNodeChild = useCallback(async () => {
    Promise.all(
      treeDataAddNodeChild.map(async (e) => await sidebarAPI.addSidebar(e))
    )
      .then(() => showToastMessageSuccess("Add Node Child"))
      .then((msgSuccess) => fetchSidebars())
      .catch(() => showToastMessageError())
      .catch((error) => console.log("error", error));
  }, [treeDataAddNodeChild]);

  const addNodeChildHandler = async () => {
    if (addNodeChildSidebar) {
      addNodeChild(addNodeChildSidebar, inputAddNodeChild);
    }
  };

  const updateHandler = async () => {
    if (updateSidebar) {
      updateNode(updateSidebar, input);
    }
  };

  const callbackUpdateNode = useCallback(async () => {
    const nodeUpdate = {
      title: treeDataUpdateNode.title,
      expanded: treeDataUpdateNode.expanded,
      parentId: treeDataUpdateNode.parentId,
      id: treeDataUpdateNode.id,
      count: treeDataUpdateNode.count,
    };
    await sidebarAPI
      .updateSidebar(nodeUpdate.id, nodeUpdate)
      .then(() => showToastMessageSuccess("Update Node"))
      .then((msgSuccess) => fetchSidebars())
      .catch(() => showToastMessageError())
      .catch((error) => console.log("error", error));
  }, [treeDataUpdateNode]);

  const callbackRemoveNode = useCallback(async () => {
    Promise.all(
      treeDataRemoveNode.map(async (e) => await sidebarAPI.deleteSidebar(e.id))
    )
      .then(() => showToastMessageSuccess("Remove Node"))
      .then((msgSuccess) => fetchSidebars())
      .catch(() => showToastMessageError())
      .catch((error) => console.log("error", error));
  }, [treeDataRemoveNode]);

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="mt-32" style={{ flex: "0 0 auto", padding: "0 15px" }}>
      <h3 className="text-3xl hello font-medium text-center mb-5">
        Sidebar Management
      </h3>
      <div className="grid grid-cols-2">
        <div className="flex mb-2">
          <button
            className="p-2 px-3 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
            onClick={createNode}
          >
            Create Node
          </button>
          <input
            className="border p-2 rounded-md transition-primary"
            ref={inputEl}
            type="text"
          />
          <br />
        </div>
        <div className="flex mb-2">
          <button
            className="p-2 px-3 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
            onClick={addNodeChild}
          >
            Add Node Child
          </button>
          <input
            className="border p-2 rounded-md transition-primary"
            ref={inputChildEl}
            type="text"
            // value={inputAddNodeChild}
            // onChange={(e) => setInputAddNodeChild(e.target.value)}
          />
          <br />
        </div>
        <div className="flex">
          <button
            className="p-2 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
            onClick={updateHandler}
          >
            Update Node
          </button>
          <input
            className="border p-2 rounded-md transition-primary"
            ref={updateInputEl}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <br />
        </div>
        <div className="flex">
          <button
            className="p-2 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
            onClick={reloadPage}
          >
            Refresh Page
          </button>

          <br />
        </div>
      </div>
      <br />
      <button
        className="p-2 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
        onClick={expandAll}
      >
        Expand All
      </button>
      <button
        className="p-2 m-2 bg-gray-200 rounded-md hover:bg-gray-400 transition-primary"
        onClick={collapseAll}
      >
        Collapse All
      </button>
      <button
        onClick={handleSaving}
        className="p-2 px-4 m-2 bg-blue-200 rounded-md hover:bg-blue-400 transition-primary"
      >
        Save
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <form
        style={{ display: "inline-block" }}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label htmlFor="find-box">
          <input
            className="border rounded-md p-2"
            id="find-box"
            type="text"
            placeholder="Search"
            value={searchString}
            onChange={(event) => setSearchString(event.target.value)}
          />
        </label>

        <button
          className="m-2 text-sky-400"
          type="button"
          disabled={!searchFoundCount}
          onClick={selectPrevMatch}
        >
          <i className="fa-solid fa-backward"></i>
        </button>

        <button
          className="m-2 text-sky-400"
          type="submit"
          disabled={!searchFoundCount}
          onClick={selectNextMatch}
        >
          <i className="fa-solid fa-forward"></i>
        </button>

        <span>
          &nbsp;
          {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
          &nbsp;/&nbsp;
          {searchFoundCount || 0}
        </span>
      </form>
    </div>
  );
};

export default HeaderSidebarManagement;
