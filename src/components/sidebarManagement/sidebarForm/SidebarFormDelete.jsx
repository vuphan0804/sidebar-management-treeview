import React, { useCallback, useRef } from "react";

const SidebarForm = ({
  isOpenFormDelete,
  onCloseFormDelete,
  removeNode,
  rowInfoDelete,
}) => {
  return (
    <div>
      {isOpenFormDelete ? (
        <>
          <div className="justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none transition-primary">
            <div className="relative w-auto my-6 mx-auto max-w-xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative px-5 flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl font-semibold">
                    Are you sure want to delete?
                  </h3>
                  <button
                    className="p-1 ml-auto t border-0 text-black "
                    onClick={onCloseFormDelete}
                  >
                    <span className="text-red-500 text-xl font-semibold">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={onCloseFormDelete}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={(event) => {
                      removeNode(rowInfoDelete);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40"></div>
        </>
      ) : null}
    </div>
  );
};

export default SidebarForm;
