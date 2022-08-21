import React, { useContext, useState, createContext } from "react";
import ConfirmModal from "./ConfirmModal";
import SucessModal from "./SucessModal";
import "./Modal.css";
import {
  deleteFile,
  restoreFile,
  updateContent,
  updateRecycleBinFile,
} from "../../api/documentApi";
import { MyContext } from "./DmTable";
import WriteModal from "./WriteModal";
import UpdateContent from "./UpdateContent";
import UpdateFile from "./UpdateFile";
import ShareUser from "./ShareUser";

const openConfirmModal = (setConfirmModalOpen, confirmModalOpen) => {
  confirmModalOpen === true
    ? setConfirmModalOpen(false)
    : setConfirmModalOpen(true);
};

const openSuccessModal = (
  setSuccessModalOpen,
  infoModalOpen,
  check,
  setCheckHandler
) => {
  setSuccessModalOpen(false);
  infoModalOpen(false);
  check ? setCheckHandler(false) : setCheckHandler(true);
};

const closeRestoreModal = (
  setSuccessModalOpen,
  infoModalOpen,
  check,
  setCheckHandler
) => {
  setSuccessModalOpen(false);
  infoModalOpen(false);
  check ? setCheckHandler(false) : setCheckHandler(true);
};

const closePermanentlyDeleteModal = (
  setPermanentlyDeleteModalOpen,
  infoModalOpen,
  check,
  setCheckHandler
) => {
  setPermanentlyDeleteModalOpen(false);
  infoModalOpen(false);
  check ? setCheckHandler(false) : setCheckHandler(true);
};

const closeInfoModal = (infoModalOpen) => {
  infoModalOpen(false);
};

const updateOpenModal = (updateModalOpen, setUpdateModalOpen) => {
  updateModalOpen ? setUpdateModalOpen(false) : setUpdateModalOpen(true);
};

const updateFileModal = (updateFileOpen, setUpdateFileOpen) => {
  updateFileOpen ? setUpdateFileOpen(false) : setUpdateFileOpen(true);
};

const Modal = (props) => {
  const { open, document, infoModalOpen } = props;
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [permanentlyDeleteModalOpen, setPermanentlyDeleteModalOpen] = useState(
    false
  );
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateFileOpen, setUpdateFileOpen] = useState(false);
  const [openShareAdd, setOpenShareAdd] = useState(false);

  const { check, setCheckHandler } = useContext(MyContext);

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div>
      <div>{props.name}</div>
      <div className={open ? "openModal modal" : "modal"}>
        {open ? (
          <section>
            <header>
              {console.log(document)}
              {document.originalName}
              {(() => {
                switch (window.location.href.split("/main")[1]) {
                  case "/trashcan":
                    return (
                      <button
                        className="close"
                        onClick={() =>
                          restoreFile(
                            [document.documentNo],
                            setSuccessModalOpen
                          )
                        }
                      >
                        복원~~~
                      </button>
                    );
                  default:
                    return (
                      <div>
                        <a href={document.filePath}>
                          <button className="close">down</button>
                        </a>
                        <button
                          className="close"
                          onClick={() => {
                            updateOpenModal(
                              updateModalOpen,
                              setUpdateModalOpen
                            );
                          }}
                        >
                          내용 수정~~~~
                        </button>
                      </div>
                    );
                }
              })()}

              <button
                className="close"
                onClick={() => {
                  openConfirmModal(setConfirmModalOpen, confirmModalOpen);
                }}
              >
                삭제
              </button>
            </header>
            <main>{document.content}</main>
            <footer>
              <button
                className="close"
                onClick={() => closeInfoModal(infoModalOpen)}
              >
                닫기
              </button>
              <button
                onClick={() => {
                  updateFileModal(updateFileOpen, setUpdateFileOpen);
                }}
              >
                문서 수정
              </button>
              <button onClick={() => setOpenShareAdd(true)}>공유자 추가</button>
            </footer>
          </section>
        ) : null}
      </div>

      <div>
        {(() => {
          switch (window.location.href.split("/main")[1]) {
            case "/trashcan":
              return (
                <ConfirmModal
                  open={confirmModalOpen}
                  close={() =>
                    openConfirmModal(setConfirmModalOpen, confirmModalOpen)
                  }
                  successModalOpen={successModalOpen}
                  act={() =>
                    deleteFile(
                      [document.documentNo],
                      setConfirmModalOpen,
                      setPermanentlyDeleteModalOpen
                    )
                  }
                >
                  <main>
                    <div>영구 삭제 하시겠습니까?</div>
                    <div>영구 삭제시 복원이 불가능 합니다.</div>
                  </main>
                </ConfirmModal>
              );
            default:
              return (
                <ConfirmModal
                  open={confirmModalOpen}
                  close={() =>
                    openConfirmModal(setConfirmModalOpen, confirmModalOpen)
                  }
                  delclose={() =>
                    openSuccessModal(setSuccessModalOpen, infoModalOpen)
                  }
                  successModalOpen={successModalOpen}
                  act={() =>
                    updateRecycleBinFile(
                      [document.documentNo],
                      setConfirmModalOpen,
                      setSuccessModalOpen
                    )
                  }
                >
                  <main>
                    <div>삭제하시겠습니까?</div>
                  </main>
                </ConfirmModal>
              );
          }
        })()}
      </div>
      {(() => {
        switch (window.location.href.split("/main")[1]) {
          case "/trashcan":
            return (
              <div>
                <SucessModal
                  open={successModalOpen}
                  close={() =>
                    closeRestoreModal(
                      setSuccessModalOpen,
                      infoModalOpen,
                      check,
                      setCheckHandler
                    )
                  }
                >
                  <main>
                    <div>복원 완료</div>
                  </main>
                </SucessModal>
                <SucessModal
                  open={permanentlyDeleteModalOpen}
                  close={() =>
                    closePermanentlyDeleteModal(
                      setPermanentlyDeleteModalOpen,
                      infoModalOpen,
                      check,
                      setCheckHandler
                    )
                  }
                >
                  <main>
                    <div>삭제 완료</div>
                  </main>
                </SucessModal>
              </div>
            );
          default:
            return (
              <SucessModal
                open={successModalOpen}
                close={() =>
                  openSuccessModal(
                    setSuccessModalOpen,
                    infoModalOpen,
                    check,
                    setCheckHandler
                  )
                }
              >
                <main>
                  <div>삭제 완료</div>
                </main>
              </SucessModal>
            );
        }
      })()}
      {
        <UpdateContent
          open={updateModalOpen}
          close={() => openConfirmModal(setUpdateModalOpen, updateModalOpen)}
          successModalOpen={successModalOpen}
          document={document}
          setUpdateModalOpen={setUpdateModalOpen}
          infoModalOpen={infoModalOpen}
          check={check}
          setCheckHandler={setCheckHandler}
        />
      }
      {
        <UpdateFile
          open={updateFileOpen}
          close={() => openConfirmModal(setUpdateFileOpen, updateFileOpen)}
          successModalOpen={successModalOpen}
          document={document}
        />
      }
    </div>
  );
};

export default Modal;
