import React, { useState, useEffect, useCallback } from "react";
import { sidebarAPI } from "../../../api/sidebarAPI";

const HeaderSidebarManagement = ({
  inputEl,
  updateInputEl,
  updateNode,
  createNode,
  expandAll,
  collapseAll,
  searchString,
  setSearchString,
  searchFoundCount,
  selectNextMatch,
  selectPrevMatch,
  searchFocusIndex,
  treeData,
  selectedSideBar,
  fetchSidebars,
  treeDataUpdateAll,
  treeDataUpdateNode,
  treeDataAddNode,
  treeDataRemoveNode,
}) => {
  const [updateSidebar, setUpdateSidebar] = useState(selectedSideBar); //rowInfo
  const [input, setInput] = useState("");
  const [originalDataAll, setOriginalDataAll] = useState([]);

  useEffect(() => {
    setUpdateSidebar(selectedSideBar);
    setInput(selectedSideBar?.node?.title || "");
  }, [selectedSideBar]);

  useEffect(() => {
    setOriginalDataAll(deParseData(treeDataUpdateAll, []));
  }, [treeDataUpdateAll]);
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
      .then((msgSuccess) => fetchSidebars())
      .catch((error) => console.log("error", error));
  }, [treeDataUpdateNode]);
  //  Add Node
  useEffect(() => {
    callbackAddNode();
  }, [treeDataAddNode]);
  // Update Node
  useEffect(() => {
    callbackUpdateNode();
  }, [treeDataUpdateNode]);
  // Remove Node
  useEffect(() => {
    callbackRemoveNode();
  }, [treeDataRemoveNode]);
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
      .then((msgSuccess) => fetchSidebars())
      .catch((error) => console.log("error", error));

    console.log("mockApiIds", mockApiIds);
  };
  const callbackAddNode = useCallback(async () => {
    Promise.all(
      treeDataAddNode.map(async (e) => await sidebarAPI.addSidebar(e))
    )
      .then((msgSuccess) => fetchSidebars())
      .catch((error) => console.log("error", error));
  }, [treeDataAddNode]);

  const updateHandler = async () => {
    if (updateSidebar) {
      updateNode(updateSidebar, input);
    }
  };

  const callbackRemoveNode = useCallback(async () => {
    Promise.all(
      treeDataRemoveNode.map(async (e) => await sidebarAPI.deleteSidebar(e.id))
    )
      .then((msgSuccess) => fetchSidebars())
      .catch((error) => console.log("error", error));
  }, [treeDataRemoveNode]);

  return (
    <div className="mt-32" style={{ flex: "0 0 auto", padding: "0 15px" }}>
      <h3 className="text-3xl font-medium text-center mb-5">
        Sidebar Management
      </h3>
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
